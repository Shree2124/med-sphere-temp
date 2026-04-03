import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { BloodGroup, Gender } from '@/generated/prisma/client';

const searchParamsSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  department: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  pageSize: z.coerce.number().min(1).max(100).optional().default(10),
});

const createPatientSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  age: z.coerce.number().int().min(0).max(130),
  gender: z.enum(['Male', 'Female', 'Other']),
  email: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined)
    .pipe(z.string().email().optional()),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),
  idProofType: z.string().optional(),
  idNumber: z.string().optional(),
  address: z.string().optional(),
});

const genderMap: Record<'Male' | 'Female' | 'Other', Gender> = {
  Male: Gender.MALE,
  Female: Gender.FEMALE,
  Other: Gender.OTHER,
};

const bloodGroupMap: Record<
  'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
  BloodGroup
> = {
  'A+': BloodGroup.A_POSITIVE,
  'A-': BloodGroup.A_NEGATIVE,
  'B+': BloodGroup.B_POSITIVE,
  'B-': BloodGroup.B_NEGATIVE,
  'AB+': BloodGroup.AB_POSITIVE,
  'AB-': BloodGroup.AB_NEGATIVE,
  'O+': BloodGroup.O_POSITIVE,
  'O-': BloodGroup.O_NEGATIVE,
};

async function generateMedicalRecordNo() {
  for (let i = 0; i < 5; i += 1) {
    const suffix = Math.floor(100000 + Math.random() * 900000);
    const mrn = `MRN${suffix}`;
    const existing = await prisma.patient.findUnique({
      where: { medicalRecordNo: mrn },
      select: { id: true },
    });
    if (!existing) return mrn;
  }
  return `MRN${Date.now()}`;
}

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const validation = searchParamsSchema.safeParse(params);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { search, status, department, page, pageSize } = validation.data;
    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { medicalRecordNo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (status && status.toLowerCase() !== 'all') {
      switch (status.toLowerCase()) {
        case 'ipd':
          where.admissions = { some: { status: 'ADMITTED' } };
          break;
        case 'emergency':
          where.appointments = {
            some: { priority: 'EMERGENCY', date: { gte: today } },
          };
          break;
        case 'discharged':
          where.admissions = { some: { status: 'DISCHARGED' } };
          break;
        case 'active':
          where.admissions = { none: { status: 'ADMITTED' } };
          break;
      }
    }

    if (department && department.toLowerCase() !== 'all') {
      const departmentSomeFilter = {
        department: {
          name: {
            equals: department,
            mode: 'insensitive' as const,
          },
        },
      };

      if (where.appointments?.some) {
        where.appointments = {
          some: {
            ...where.appointments.some,
            ...departmentSomeFilter,
          },
        };
      } else {
        where.appointments = { some: departmentSomeFilter };
      }
    }

    const totalPatients = await prisma.patient.count({ where });
    const patients = await prisma.patient.findMany({
      where,
      include: {
        admissions: {
          orderBy: { admissionDate: 'desc' },
          take: 1,
        },
        appointments: {
          orderBy: { date: 'desc' },
          take: 1,
          include: { department: true },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { id: 'desc' },
    });

    const formattedPatients = patients.map((p) => {
      const latestAdmission = p.admissions[0];
      const latestAppointment = p.appointments[0];

      let patientStatus = 'Active';
      if (latestAdmission?.status === 'ADMITTED') {
        patientStatus = 'IPD';
      } else if (latestAdmission?.status === 'DISCHARGED') {
        patientStatus = 'Discharged';
      } else if (
        latestAppointment?.priority === 'EMERGENCY' &&
        new Date(latestAppointment.date) >= today
      ) {
        patientStatus = 'Emergency';
      }

      return {
        id: p.medicalRecordNo,
        name: `${p.firstName} ${p.lastName}`,
        email: p.email,
        age: new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear(),
        gender: p.gender,
        bloodGroup: p.bloodGroup,
        phone: p.contactNumber,
        department: latestAppointment?.department?.name || 'N/A',
        status: patientStatus,
      };
    });

    return NextResponse.json({
      data: formattedPatients,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(totalPatients / pageSize),
        total: totalPatients,
      },
    });
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createPatientSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          message: 'Invalid patient data',
          errors: validated.error.format(),
        },
        { status: 400 }
      );
    }

    const {
      name,
      phone,
      age,
      gender,
      email,
      bloodGroup,
      idProofType,
      idNumber,
      address,
    } = validated.data;

    const trimmedName = name.trim();
    const [firstName, ...rest] = trimmedName.split(/\s+/);
    const lastName = rest.join(' ') || '-';

    const now = new Date();
    const birthYear = now.getFullYear() - age;
    const dateOfBirth = new Date(birthYear, 0, 1);

    const patient = await prisma.patient.create({
      data: {
        medicalRecordNo: await generateMedicalRecordNo(),
        firstName,
        lastName,
        dateOfBirth,
        gender: genderMap[gender],
        bloodGroup: bloodGroup ? bloodGroupMap[bloodGroup] : undefined,
        contactNumber: phone.trim(),
        email,
        address: address?.trim() || undefined,
        identificationType: idProofType?.trim() || undefined,
        identificationNumber: idNumber?.trim() || undefined,
      },
      select: {
        id: true,
        medicalRecordNo: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        patient,
        message: 'Patient created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create patient:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
