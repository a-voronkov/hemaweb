import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MedicalCentersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all active medical centers
   */
  async getAllCenters() {
    const centers = await this.prisma.medicalCenter.findMany({
      where: { isActive: true },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return { data: centers };
  }

  /**
   * Get medical center by ID
   */
  async getCenterById(id: string) {
    const center = await this.prisma.medicalCenter.findUnique({
      where: { id },
      include: {
        organization: true,
      },
    });

    if (!center) {
      throw new NotFoundException('Medical center not found');
    }

    return { data: center };
  }

  /**
   * Search medical centers by location
   */
  async searchNearby(lat: number, lng: number, radiusKm: number = 10) {
    // Using PostGIS ST_DWithin for radius search
    // Note: This is a simplified version. In production, use proper PostGIS queries
    const centers = await this.prisma.medicalCenter.findMany({
      where: {
        isActive: true,
        locationLat: { not: null },
        locationLng: { not: null },
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Calculate distance and filter
    const nearbyCenters = centers
      .map(center => {
        const distance = this.calculateDistance(
          lat,
          lng,
          center.locationLat!,
          center.locationLng!
        );
        return { ...center, distance };
      })
      .filter(center => center.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    return { data: nearbyCenters };
  }

  /**
   * Verify a donor (staff/admin only)
   */
  async verifyDonor(
    staffUserId: string,
    donorUserId: string,
    medicalCenterId: string,
    notes?: string
  ) {
    // Check if staff has permission
    const staff = await this.prisma.medicalCenterStaff.findUnique({
      where: { userId: staffUserId },
      include: { user: { include: { role: true } } },
    });

    if (!staff) {
      throw new ForbiddenException('Only medical center staff can verify donors');
    }

    // Check if staff belongs to this center
    if (staff.medicalCenterId !== medicalCenterId) {
      throw new ForbiddenException('You can only verify donors at your medical center');
    }

    // Get donor profile
    const donor = await this.prisma.profile.findUnique({
      where: { userId: donorUserId },
      include: { user: true },
    });

    if (!donor) {
      throw new NotFoundException('Donor not found');
    }

    // Get donor's blood type or use a default
    const bloodTypeId = donor.bloodTypeId || (await this.prisma.bloodTypeRef.findFirst({ where: { code: 'O+' } }))?.id;

    if (!bloodTypeId) {
      throw new BadRequestException('Blood type not found');
    }

    // Create verification record
    const verification = await this.prisma.verificationRecord.create({
      data: {
        profileId: donor.id,
        medicalCenterId,
        verifiedById: staffUserId,
        bloodTypeId,
        isEligible: true,
        verifiedAt: new Date(),
        notes,
      },
    });

    // Update donor profile
    await this.prisma.profile.update({
      where: { id: donor.id },
      data: { isDonorVerified: true },
    });

    return {
      message: 'Donor verified successfully',
      verification,
    };
  }

  /**
   * Record a blood donation (staff/admin only)
   */
  async recordDonation(
    staffUserId: string,
    donorUserId: string,
    medicalCenterId: string,
    bloodTypeId: string,
    volumeMl: number,
    notes?: string
  ) {
    // Check if staff has permission
    const staff = await this.prisma.medicalCenterStaff.findUnique({
      where: { userId: staffUserId },
    });

    if (!staff) {
      throw new ForbiddenException('Only medical center staff can record donations');
    }

    if (staff.medicalCenterId !== medicalCenterId) {
      throw new ForbiddenException('You can only record donations at your medical center');
    }

    // Check if donor is verified
    const donor = await this.prisma.profile.findUnique({
      where: { userId: donorUserId },
    });

    if (!donor?.isDonorVerified) {
      throw new BadRequestException('Donor must be verified before donating');
    }

    // Create donation record
    const donation = await this.prisma.donationRecord.create({
      data: {
        profileId: donor.id,
        medicalCenterId,
        bloodTypeId,
        volumeMl,
        donationDate: new Date(),
        recordedById: staffUserId,
        notes,
      },
      include: {
        bloodType: true,
        medicalCenter: true,
      },
    });

    // Update donor's last donation date and next eligible date (56 days later)
    const nextEligibleDate = new Date();
    nextEligibleDate.setDate(nextEligibleDate.getDate() + 56);

    await this.prisma.profile.update({
      where: { id: donor.id },
      data: {
        lastDonationDate: new Date(),
        nextEligibleDate,
      },
    });

    return {
      message: 'Donation recorded successfully',
      donation,
    };
  }

  /**
   * Calculate distance between two points (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get staff's medical center
   */
  async getStaffCenter(userId: string) {
    const staff = await this.prisma.medicalCenterStaff.findUnique({
      where: { userId },
      include: {
        medicalCenter: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!staff?.medicalCenter) {
      throw new NotFoundException('Medical center not found');
    }

    return { data: staff.medicalCenter };
  }

  /**
   * Get donors at staff's center
   */
  async getCenterDonors(userId: string) {
    const staff = await this.prisma.medicalCenterStaff.findUnique({
      where: { userId },
    });

    if (!staff) {
      throw new ForbiddenException('Staff profile not found');
    }

    const verifications = await this.prisma.verificationRecord.findMany({
      where: { medicalCenterId: staff.medicalCenterId },
      include: {
        profile: {
          include: {
            user: true,
            bloodType: true,
          },
        },
        bloodType: true,
      },
      orderBy: { verifiedAt: 'desc' },
    });

    // Transform to match expected format
    const transformed = verifications.map(v => ({
      ...v,
      user: {
        ...v.profile.user,
        profile: {
          ...v.profile,
          bloodType: v.bloodType,
        },
      },
    }));

    return { data: transformed };
  }

  /**
   * Get donations at staff's center
   */
  async getCenterDonations(userId: string) {
    const staff = await this.prisma.medicalCenterStaff.findUnique({
      where: { userId },
    });

    if (!staff) {
      throw new ForbiddenException('Staff profile not found');
    }

    const donations = await this.prisma.donationRecord.findMany({
      where: { medicalCenterId: staff.medicalCenterId },
      include: {
        profile: {
          include: {
            user: true,
          },
        },
        bloodType: true,
      },
      orderBy: { donationDate: 'desc' },
      take: 100,
    });

    // Transform to match expected format
    const transformed = donations.map(d => ({
      ...d,
      donatedAt: d.donationDate,
      user: {
        ...d.profile.user,
        profile: d.profile,
      },
    }));

    return { data: transformed };
  }
}

