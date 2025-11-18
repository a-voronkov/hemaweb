import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateBloodDriveDto } from './dto/create-blood-drive.dto';
import { UpdateBloodDriveDto } from './dto/update-blood-drive.dto';

@Injectable()
export class BloodDrivesService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  /**
   * Get all blood drives
   */
  async getAllBloodDrives(status?: string, type?: string): Promise<{ data: any[] }> {
    const where: any = { deletedAt: null };

    if (status) {
      const statusRef = await this.prisma.bloodDriveStatusRef.findUnique({ where: { code: status } });
      if (statusRef) where.statusId = statusRef.id;
    }

    if (type) {
      const typeRef = await this.prisma.bloodDriveTypeRef.findUnique({ where: { code: type } });
      if (typeRef) where.typeId = typeRef.id;
    }

    const bloodDrives = await this.prisma.bloodDrive.findMany({
      where,
      include: {
        medicalCenter: {
          include: {
            organization: true,
          },
        },
        type: true,
        status: true,
        bloodTypesNeeded: {
          include: {
            bloodType: true,
          },
        },
      },
      orderBy: { startDateTime: 'asc' },
    });

    return { data: bloodDrives };
  }

  /**
   * Get nearby blood drives
   */
  async getNearbyBloodDrives(lat: number, lng: number, radiusKm: number = 50, bloodType?: string): Promise<{ data: any[] }> {
    const bloodDrives = await this.prisma.bloodDrive.findMany({
      where: {
        deletedAt: null,
        startDateTime: { gte: new Date() },
      },
      include: {
        medicalCenter: true,
        type: true,
        status: true,
        bloodTypesNeeded: {
          include: {
            bloodType: true,
          },
        },
      },
    });

    // Calculate distance and filter
    const nearbyDrives = bloodDrives
      .map(drive => {
        const distance = this.calculateDistance(
          lat,
          lng,
          drive.medicalCenter.locationLat!,
          drive.medicalCenter.locationLng!
        );
        return { ...drive, distance };
      })
      .filter(drive => drive.distance <= radiusKm);

    // Filter by blood type if specified
    let filtered = nearbyDrives;
    if (bloodType) {
      filtered = nearbyDrives.filter(drive =>
        drive.bloodTypesNeeded.some(bt => bt.bloodType.code === bloodType)
      );
    }

    // Sort by distance
    filtered.sort((a, b) => a.distance - b.distance);

    return { data: filtered };
  }

  /**
   * Get blood drive by ID
   */
  async getBloodDriveById(id: string): Promise<{ data: any }> {
    const bloodDrive = await this.prisma.bloodDrive.findUnique({
      where: { id },
      include: {
        medicalCenter: {
          include: {
            organization: true,
          },
        },
        type: true,
        status: true,
        bloodTypesNeeded: {
          include: {
            bloodType: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            medicalCenterStaff: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!bloodDrive) {
      throw new NotFoundException('Blood drive not found');
    }

    return { data: bloodDrive };
  }

  /**
   * Create blood drive
   */
  async createBloodDrive(userId: string, dto: CreateBloodDriveDto): Promise<{ message: string; data: any }> {
    // Get staff info
    const staff = await this.prisma.medicalCenterStaff.findUnique({
      where: { userId },
    });

    if (!staff?.medicalCenterId) {
      throw new ForbiddenException('Only medical center staff can create blood drives');
    }

    // Get type and status
    const type = await this.prisma.bloodDriveTypeRef.findUnique({ where: { code: dto.typeCode } });
    const status = await this.prisma.bloodDriveStatusRef.findUnique({ where: { code: 'upcoming' } });

    if (!type || !status) {
      throw new BadRequestException('Invalid blood drive type or status');
    }

    // Get blood types if specified
    const bloodTypeIds: string[] = [];
    if (dto.bloodTypesNeeded && dto.bloodTypesNeeded.length > 0) {
      const bloodTypes = await this.prisma.bloodTypeRef.findMany({
        where: { code: { in: dto.bloodTypesNeeded } },
      });
      bloodTypeIds.push(...bloodTypes.map(bt => bt.id));
    }

    // Create blood drive
    const bloodDrive = await this.prisma.bloodDrive.create({
      data: {
        medicalCenterId: staff.medicalCenterId,
        createdById: userId,
        typeId: type.id,
        statusId: status.id,
        title: dto.title,
        description: dto.description,
        startDateTime: new Date(dto.startDateTime),
        endDateTime: new Date(dto.endDateTime),
        targetDonors: dto.targetDonors,
        radiusKm: dto.radiusKm || 10,
        bloodTypesNeeded: {
          create: bloodTypeIds.map(btId => ({
            bloodTypeId: btId,
          })),
        },
      },
      include: {
        medicalCenter: true,
        type: true,
        status: true,
        bloodTypesNeeded: {
          include: {
            bloodType: true,
          },
        },
      },
    });

    return {
      message: 'Blood drive created successfully',
      data: bloodDrive,
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
   * Update blood drive
   */
  async updateBloodDrive(userId: string, id: string, dto: UpdateBloodDriveDto): Promise<{ message: string; data: any }> {
    const bloodDrive = await this.prisma.bloodDrive.findUnique({
      where: { id },
      include: { medicalCenter: true },
    });

    if (!bloodDrive) {
      throw new NotFoundException('Blood drive not found');
    }

    // Check if user has permission
    const staff = await this.prisma.medicalCenterStaff.findUnique({
      where: { userId },
    });

    if (!staff || staff.medicalCenterId !== bloodDrive.medicalCenterId) {
      throw new ForbiddenException('You can only update blood drives at your medical center');
    }

    const updateData: any = {};

    if (dto.title) updateData.title = dto.title;
    if (dto.description) updateData.description = dto.description;
    if (dto.startDateTime) updateData.startDateTime = new Date(dto.startDateTime);
    if (dto.endDateTime) updateData.endDateTime = new Date(dto.endDateTime);
    if (dto.targetDonors) updateData.targetDonors = dto.targetDonors;

    if (dto.statusCode) {
      const status = await this.prisma.bloodDriveStatusRef.findUnique({ where: { code: dto.statusCode } });
      if (status) updateData.statusId = status.id;
    }

    const updated = await this.prisma.bloodDrive.update({
      where: { id },
      data: updateData,
      include: {
        medicalCenter: true,
        type: true,
        status: true,
        bloodTypesNeeded: {
          include: {
            bloodType: true,
          },
        },
      },
    });

    return {
      message: 'Blood drive updated successfully',
      data: updated,
    };
  }

  /**
   * Delete blood drive (soft delete)
   */
  async deleteBloodDrive(userId: string, id: string) {
    const bloodDrive = await this.prisma.bloodDrive.findUnique({
      where: { id },
    });

    if (!bloodDrive) {
      throw new NotFoundException('Blood drive not found');
    }

    // Check if user has permission
    const staff = await this.prisma.medicalCenterStaff.findUnique({
      where: { userId },
    });

    if (!staff || staff.medicalCenterId !== bloodDrive.medicalCenterId) {
      throw new ForbiddenException('You can only delete blood drives at your medical center');
    }

    await this.prisma.bloodDrive.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Blood drive deleted successfully' };
  }

  /**
   * Get blood drives by medical center
   */
  async getBloodDrivesByCenter(centerId: string) {
    const bloodDrives = await this.prisma.bloodDrive.findMany({
      where: {
        medicalCenterId: centerId,
        deletedAt: null,
      },
      include: {
        type: true,
        status: true,
        bloodTypesNeeded: {
          include: {
            bloodType: true,
          },
        },
      },
      orderBy: { startDateTime: 'desc' },
    });

    return { data: bloodDrives };
  }

  /**
   * Register for blood drive
   */
  async registerForBloodDrive(userId: string, bloodDriveId: string) {
    // Get donor profile with user info
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Donor profile not found');
    }

    if (!profile.isDonorVerified) {
      throw new BadRequestException('You must be verified before registering for blood drives');
    }

    // Get blood drive details
    const bloodDrive = await this.prisma.bloodDrive.findUnique({
      where: { id: bloodDriveId },
      include: {
        medicalCenter: true,
      },
    });

    if (!bloodDrive) {
      throw new NotFoundException('Blood drive not found');
    }

    // Check if already registered
    const existing = await this.prisma.bloodDriveRegistration.findFirst({
      where: {
        bloodDriveId,
        profileId: profile.id,
      },
    });

    if (existing) {
      throw new BadRequestException('You are already registered for this blood drive');
    }

    // Create registration
    const registration = await this.prisma.bloodDriveRegistration.create({
      data: {
        bloodDriveId,
        profileId: profile.id,
      },
    });

    // Send confirmation email
    try {
      await this.emailService.sendBloodDriveRegistrationConfirmation(
        profile.user.email,
        profile.firstName || 'Donor',
        {
          title: bloodDrive.title,
          startDateTime: bloodDrive.startDateTime.toISOString(),
          medicalCenter: {
            name: bloodDrive.medicalCenter.name,
            address: bloodDrive.medicalCenter.address,
            city: bloodDrive.medicalCenter.city,
            phone: bloodDrive.medicalCenter.phone,
          },
        },
      );
    } catch (error) {
      // Log error but don't fail registration
      console.error('Failed to send confirmation email:', error);
    }

    return {
      message: 'Successfully registered for blood drive',
      data: registration,
    };
  }

  /**
   * Cancel registration
   */
  async cancelRegistration(userId: string, bloodDriveId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Donor profile not found');
    }

    const registration = await this.prisma.bloodDriveRegistration.findFirst({
      where: {
        bloodDriveId,
        profileId: profile.id,
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    await this.prisma.bloodDriveRegistration.delete({
      where: { id: registration.id },
    });

    return { message: 'Registration cancelled successfully' };
  }

  /**
   * Get blood drive registrations
   */
  async getBloodDriveRegistrations(bloodDriveId: string) {
    const registrations = await this.prisma.bloodDriveRegistration.findMany({
      where: { bloodDriveId },
      include: {
        profile: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
            bloodType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data: registrations };
  }
}

