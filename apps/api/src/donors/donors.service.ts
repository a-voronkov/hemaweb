import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DonorsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get donor statistics for dashboard
   */
  async getDonorStats(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        bloodType: true,
        donationRecords: {
          where: { deletedAt: null },
          orderBy: { donationDate: 'desc' },
          take: 5,
          include: {
            bloodType: true,
            medicalCenter: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Donor profile not found');
    }

    const totalDonations = await this.prisma.donationRecord.count({
      where: {
        profileId: profile.id,
        deletedAt: null,
      },
    });

    const lastDonation = await this.prisma.donationRecord.findFirst({
      where: {
        profileId: profile.id,
        deletedAt: null,
      },
      orderBy: { donationDate: 'desc' },
    });

    // Calculate next eligible date (56 days after last donation for whole blood)
    let nextEligibleDate: Date | null = null;
    if (lastDonation) {
      nextEligibleDate = new Date(lastDonation.donationDate);
      nextEligibleDate.setDate(nextEligibleDate.getDate() + 56);
    }

    // Get upcoming appointments
    const upcomingAppointments = await this.prisma.bloodDriveAppointment.findMany({
      where: {
        profileId: profile.id,
        appointmentDate: {
          gte: new Date(),
        },
        status: { code: 'confirmed' },
      },
      include: {
        bloodDrive: {
          include: {
            medicalCenter: true,
          },
        },
      },
      orderBy: { appointmentDate: 'asc' },
      take: 5,
    });

    return {
      totalDonations,
      lastDonationDate: lastDonation?.donationDate,
      nextEligibleDate,
      bloodType: profile.bloodType?.name,
      isDonorVerified: profile.isDonorVerified,
      upcomingAppointments: upcomingAppointments.map(apt => ({
        id: apt.id,
        date: apt.appointmentDate,
        bloodDrive: {
          name: apt.bloodDrive.name,
          location: apt.bloodDrive.location,
        },
      })),
      recentDonations: profile.donationRecords.map(donation => ({
        id: donation.id,
        donationDate: donation.donationDate,
        bloodType: donation.bloodType.name,
        volume: donation.volumeMl,
        medicalCenter: {
          name: donation.medicalCenter.name,
        },
      })),
    };
  }

  /**
   * Get donor donation history
   */
  async getDonorDonations(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Donor profile not found');
    }

    const donations = await this.prisma.donationRecord.findMany({
      where: {
        profileId: profile.id,
        deletedAt: null,
      },
      include: {
        bloodType: true,
        medicalCenter: true,
      },
      orderBy: { donationDate: 'desc' },
    });

    return {
      data: donations.map(donation => ({
        id: donation.id,
        donationDate: donation.donationDate,
        bloodType: donation.bloodType.name,
        volume: donation.volumeMl,
        hemoglobin: donation.hemoglobin,
        bloodPressure: donation.bloodPressure,
        status: 'completed', // Assuming all records are completed
        medicalCenter: {
          id: donation.medicalCenter.id,
          name: donation.medicalCenter.name,
          city: donation.medicalCenter.city,
        },
      })),
    };
  }

  /**
   * Get donor achievements
   */
  async getDonorAchievements(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Donor profile not found');
    }

    const totalDonations = await this.prisma.donationRecord.count({
      where: {
        profileId: profile.id,
        deletedAt: null,
      },
    });

    // Calculate total volume
    const donations = await this.prisma.donationRecord.findMany({
      where: {
        profileId: profile.id,
        deletedAt: null,
      },
      select: { volumeMl: true },
    });

    const totalVolume = donations.reduce((sum, d) => sum + d.volumeMl, 0);
    const livesSaved = totalDonations * 3; // Estimate: 1 donation saves 3 lives

    // Calculate consecutive years (simplified)
    const consecutiveYears = 0; // TODO: Implement proper calculation

    // Define achievements
    const achievements = [
      {
        id: '1',
        title: 'First Drop',
        description: 'Complete your first blood donation',
        icon: 'heart',
        unlocked: totalDonations >= 1,
        unlockedAt: totalDonations >= 1 ? new Date().toISOString() : undefined,
        progress: Math.min(totalDonations, 1),
        target: 1,
      },
      {
        id: '2',
        title: 'Regular Donor',
        description: 'Complete 5 blood donations',
        icon: 'award',
        unlocked: totalDonations >= 5,
        unlockedAt: totalDonations >= 5 ? new Date().toISOString() : undefined,
        progress: Math.min(totalDonations, 5),
        target: 5,
      },
      {
        id: '3',
        title: 'Dedicated Donor',
        description: 'Complete 10 blood donations',
        icon: 'trophy',
        unlocked: totalDonations >= 10,
        unlockedAt: totalDonations >= 10 ? new Date().toISOString() : undefined,
        progress: Math.min(totalDonations, 10),
        target: 10,
      },
      {
        id: '4',
        title: 'Hero',
        description: 'Complete 25 blood donations',
        icon: 'star',
        unlocked: totalDonations >= 25,
        unlockedAt: totalDonations >= 25 ? new Date().toISOString() : undefined,
        progress: Math.min(totalDonations, 25),
        target: 25,
      },
      {
        id: '5',
        title: 'Legend',
        description: 'Complete 50 blood donations',
        icon: 'trophy',
        unlocked: totalDonations >= 50,
        unlockedAt: totalDonations >= 50 ? new Date().toISOString() : undefined,
        progress: Math.min(totalDonations, 50),
        target: 50,
      },
    ];

    return {
      totalDonations,
      totalVolume,
      livesSaved,
      consecutiveYears,
      achievements,
    };
  }
}

