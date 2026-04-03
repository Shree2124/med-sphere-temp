import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const totalPatients = await prisma.patient.count();
    const todayOPD = await prisma.appointment.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const totalBeds = await prisma.bed.count();
    const occupiedBeds = await prisma.bed.count({ where: { isOccupied: true } });
    const maintenanceBeds = await prisma.bed.count({ where: { isActive: false } });
    const availableBeds = totalBeds - occupiedBeds - maintenanceBeds;

    const revenueResult = await prisma.bill.aggregate({
      _sum: {
        netAmount: true,
      },
      where: {
        issuedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
    const todayRevenue = revenueResult._sum.netAmount || 0;

    const emergencyCases = await prisma.appointment.count({
      where: {
        priority: 'EMERGENCY',
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const surgeriesToday = await prisma.medicalRecord.count({
        where: {
            visitType: 'OP',
            createdAt: {
                gte: today,
                lt: tomorrow,
            }
        }
    });

    const labTestsPending = await prisma.labOrder.count({
      where: { status: 'PENDING' },
    });

    const criticalWards = await prisma.ward.findMany({
        where: {
            type: { in: ['ICU', 'CCU'] }
        },
        select: { id: true }
    });
    const criticalWardIds = criticalWards.map(w => w.id);

    const criticalPatients = await prisma.admission.count({
        where: {
            status: 'ADMITTED',
            wardId: { in: criticalWardIds }
        }
    });

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayIPD = await prisma.admission.count({
        where: {
            admissionDate: {
                gte: today,
                lt: tomorrow,
            }
        }
    });

    const monthlyRevenueResult = await prisma.bill.aggregate({
        _sum: { netAmount: true },
        where: {
            issuedAt: { gte: monthStart }
        }
    });
    const monthlyRevenue = monthlyRevenueResult._sum.netAmount || 0;

    const pendingBills = await prisma.bill.count({
        where: {
            status: { in: ['PENDING', 'PARTIALLY_PAID'] }
        }
    });

    const stats = {
      todayIPD,
      monthlyRevenue,
      pendingBills,
      totalPatients,
      todayOPD,
      totalBeds,
      occupiedBeds,
      availableBeds,
      maintenanceBeds,
      todayRevenue,
      emergencyCases,
      surgeriesToday,
      labTestsPending,
      criticalPatients,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
