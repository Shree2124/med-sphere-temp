import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { AppointmentStatus } from '@/generated/prisma/client';

const getAppointmentsSchema = z.object({
  date: z.string().optional(),
});

const createAppointmentSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  visitType: z.string().min(1),
});

function getDayBounds(dateString?: string) {
  const date = dateString ? new Date(dateString) : new Date();
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

function parseSlotToDate(dateString: string, timeString: string) {
  const match = timeString.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    throw new Error('Invalid time format');
  }

  const [, hh, mm, period] = match;
  let hour = Number(hh);
  const minutes = Number(mm);

  if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;

  const base = new Date(dateString);
  if (Number.isNaN(base.getTime())) {
    throw new Error('Invalid date');
  }

  base.setHours(hour, minutes, 0, 0);
  return base;
}

function formatStatus(status: AppointmentStatus) {
  switch (status) {
    case AppointmentStatus.CONFIRMED:
      return 'Confirmed';
    case AppointmentStatus.CHECKED_IN:
    case AppointmentStatus.IN_CONSULTATION:
      return 'In Progress';
    case AppointmentStatus.COMPLETED:
      return 'Completed';
    case AppointmentStatus.CANCELLED:
      return 'Cancelled';
    case AppointmentStatus.NO_SHOW:
      return 'No Show';
    case AppointmentStatus.RESCHEDULED:
      return 'Rescheduled';
    case AppointmentStatus.SCHEDULED:
    default:
      return 'Scheduled';
  }
}

async function generateAppointmentNo() {
  for (let i = 0; i < 5; i += 1) {
    const suffix = Math.floor(100000 + Math.random() * 900000);
    const appointmentNo = `APT${suffix}`;
    const existing = await prisma.appointment.findUnique({
      where: { appointmentNo },
      select: { id: true },
    });
    if (!existing) return appointmentNo;
  }
  return `APT${Date.now()}`;
}

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const validated = getAppointmentsSchema.safeParse(params);

    if (!validated.success) {
      return NextResponse.json(
        { message: 'Invalid query parameters', errors: validated.error.format() },
        { status: 400 }
      );
    }

    const { start, end } = getDayBounds(validated.data.date);

    const [appointments, doctors] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          date: {
            gte: start,
            lt: end,
          },
        },
        include: {
          patient: true,
          doctor: {
            include: {
              user: true,
              staffProfile: true,
              department: true,
            },
          },
          department: true,
        },
        orderBy: { date: 'asc' },
      }),
      prisma.doctor.findMany({
        include: {
          user: true,
          staffProfile: true,
          department: true,
        },
        orderBy: {
          user: {
            firstName: 'asc',
          },
        },
      }),
    ]);

    const formattedAppointments = appointments.map((a, index) => ({
      id: a.id,
      appointmentNo: a.appointmentNo,
      patientId: a.patient.medicalRecordNo,
      patientName: `${a.patient.firstName} ${a.patient.lastName}`,
      doctor: a.doctor.user
        ? `${a.doctor.user.firstName} ${a.doctor.user.lastName}`
        : `Dr. ${a.doctor.staffProfile.employeeId}`,
      doctorId: a.doctor.id,
      department: a.department?.name || a.doctor.department.name,
      date: a.date.toISOString().split('T')[0],
      time: a.date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      token: index + 1,
      status: formatStatus(a.status),
      type: a.reason || 'Consultation',
    }));

    const formattedDoctors = doctors.map((d) => {
      const doctorName = d.user
        ? `${d.user.firstName} ${d.user.lastName}`
        : `Dr. ${d.staffProfile.employeeId}`;

      return {
        id: d.id,
        name: doctorName,
        department: d.department.name,
        status: d.available ? 'Available' : 'Unavailable',
      };
    });

    return NextResponse.json({
      data: formattedAppointments,
      doctors: formattedDoctors,
    });
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createAppointmentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { message: 'Invalid appointment data', errors: validated.error.format() },
        { status: 400 }
      );
    }

    const { patientId, doctorId, date, time, visitType } = validated.data;

    const patient = await prisma.patient.findFirst({
      where: {
        OR: [
          { medicalRecordNo: patientId.trim() },
          { firstName: { contains: patientId.trim(), mode: 'insensitive' } },
          { lastName: { contains: patientId.trim(), mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!patient) {
      return NextResponse.json(
        { message: 'Patient not found for the provided Patient ID/Name' },
        { status: 404 }
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: {
        id: true,
        departmentId: true,
      },
    });

    if (!doctor) {
      return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
    }

    const appointmentDate = parseSlotToDate(date, time);

    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: appointmentDate,
        status: {
          not: AppointmentStatus.CANCELLED,
        },
      },
      select: { id: true },
    });

    if (conflict) {
      return NextResponse.json(
        { message: 'Selected slot is already booked for this doctor' },
        { status: 409 }
      );
    }

    const endTime = new Date(appointmentDate);
    endTime.setMinutes(endTime.getMinutes() + 30);

    const appointment = await prisma.appointment.create({
      data: {
        appointmentNo: await generateAppointmentNo(),
        patientId: patient.id,
        doctorId: doctor.id,
        departmentId: doctor.departmentId,
        date: appointmentDate,
        endTime,
        reason: visitType,
        status: AppointmentStatus.SCHEDULED,
      },
      select: {
        id: true,
        appointmentNo: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        appointment,
        message: 'Appointment booked successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to book appointment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
