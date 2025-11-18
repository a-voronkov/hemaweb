import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const [
      totalDonors,
      verifiedDonors,
      totalDonations,
      totalBloodDrives,
      upcomingBloodDrives,
      activeBloodDrives,
      totalMedicalCenters,
      totalStaff,
    ] = await Promise.all([
      // Total donors
      this.prisma.profile.count(),
      
      // Verified donors
      this.prisma.profile.count({
        where: { isDonorVerified: true },
      }),
      
      // Total donations
      this.prisma.donationRecord.count({
        where: { deletedAt: null },
      }),
      
      // Total blood drives
      this.prisma.bloodDrive.count({
        where: { deletedAt: null },
      }),
      
      // Upcoming blood drives
      this.prisma.bloodDrive.count({
        where: {
          deletedAt: null,
          status: { code: 'upcoming' },
        },
      }),
      
      // Active blood drives
      this.prisma.bloodDrive.count({
        where: {
          deletedAt: null,
          status: { code: 'active' },
        },
      }),
      
      // Total medical centers
      this.prisma.medicalCenter.count({
        where: { deletedAt: null },
      }),
      
      // Total staff
      this.prisma.medicalCenterStaff.count(),
    ]);

    // Get recent donations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentDonations = await this.prisma.donationRecord.count({
      where: {
        deletedAt: null,
        donationDate: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get blood type distribution
    const bloodTypeDistribution = await this.prisma.profile.groupBy({
      by: ['bloodTypeId'],
      _count: true,
      where: {
        bloodTypeId: { not: null },
      },
    });

    const bloodTypeStats = await Promise.all(
      bloodTypeDistribution.map(async (item) => {
        const bloodType = await this.prisma.bloodTypeRef.findUnique({
          where: { id: item.bloodTypeId! },
        });
        return {
          bloodType: bloodType?.name || 'Unknown',
          count: item._count,
        };
      })
    );

    // Get donation volume by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const donationsByMonth = await this.prisma.$queryRaw<Array<{ month: string; count: bigint; volume: bigint }>>`
      SELECT
        TO_CHAR("donationDate", 'YYYY-MM') as month,
        COUNT(*) as count,
        SUM("volumeMl") as volume
      FROM donation_records
      WHERE "donationDate" >= ${sixMonthsAgo}
        AND "deletedAt" IS NULL
      GROUP BY TO_CHAR("donationDate", 'YYYY-MM')
      ORDER BY month DESC
    `;

    return {
      overview: {
        totalDonors,
        verifiedDonors,
        totalDonations,
        recentDonations,
        totalBloodDrives,
        upcomingBloodDrives,
        activeBloodDrives,
        totalMedicalCenters,
        totalStaff,
      },
      bloodTypeDistribution: bloodTypeStats,
      donationsByMonth: donationsByMonth.map(row => ({
        month: row.month,
        count: Number(row.count),
        volume: Number(row.volume),
      })),
    };
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 20) {
    const recentDonations = await this.prisma.donationRecord.findMany({
      where: { deletedAt: null },
      include: {
        profile: {
          include: {
            user: {
              select: { email: true },
            },
          },
        },
        bloodType: true,
        medicalCenter: true,
      },
      orderBy: { donationDate: 'desc' },
      take: limit,
    });

    return recentDonations.map(donation => ({
      id: donation.id,
      type: 'donation',
      date: donation.donationDate,
      donor: {
        name: `${donation.profile.firstName} ${donation.profile.lastName}`,
        email: donation.profile.user.email,
      },
      bloodType: donation.bloodType.name,
      volume: donation.volumeMl,
      medicalCenter: donation.medicalCenter.name,
    }));
  }
}

