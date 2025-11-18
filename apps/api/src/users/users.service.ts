import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get user profile by user ID
   */
  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      profile: user.profile,
      role: {
        id: user.role.id,
        code: user.role.code,
        name: user.role.name,
      },
    };
  }

  /**
   * Get current user's profile
   */
  async getMyProfile(userId: string) {
    return this.getUserProfile(userId);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update profile
    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: {
        ...updateProfileDto,
        dateOfBirth: updateProfileDto.dateOfBirth
          ? new Date(updateProfileDto.dateOfBirth)
          : undefined,
      },
    });

    return updatedProfile;
  }

  /**
   * Get user by ID (for other users to view)
   */
  async getUserById(userId: string, requestingUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ForbiddenException('User account is deactivated');
    }

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    // Return limited info for other users
    return {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      profile: {
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        // Don't expose phone, address, etc. to other users
      },
      role: {
        code: user.role.code,
        name: user.role.name,
      },
    };
  }

  /**
   * Search users (admin only or by exact email)
   */
  async searchUsers(query: string, page: number = 1, limit: number = 10): Promise<{
    data: any[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const skip = (page - 1) * limit;

    // Check if query is an email (exact match)
    const isEmail = query.includes('@');

    const whereClause = isEmail
      ? { email: { equals: query, mode: 'insensitive' as const } }
      : {
          OR: [
            { email: { contains: query, mode: 'insensitive' as const } },
            { profile: { firstName: { contains: query, mode: 'insensitive' as const } } },
            { profile: { lastName: { contains: query, mode: 'insensitive' as const } } },
          ],
        };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereClause,
        include: {
          profile: {
            include: {
              bloodType: true,
            },
          },
          role: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({
        where: whereClause,
      }),
    ]);

    // Remove sensitive data
    const usersWithoutPasswords = users.map(({ passwordHash, ...user }) => user);

    return {
      data: usersWithoutPasswords,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get donation history for current user
   */
  async getMyDonationHistory(userId: string, page: number = 1, limit: number = 20): Promise<{
    data: any[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    // Get user's profile
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      throw new NotFoundException('User profile not found');
    }

    const skip = (page - 1) * limit;

    const [donations, total] = await Promise.all([
      this.prisma.donationRecord.findMany({
        where: {
          profileId: user.profile.id,
          deletedAt: null,
        },
        include: {
          bloodType: true,
          medicalCenter: {
            include: {
              organization: true,
            },
          },
          recordedBy: {
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
        orderBy: { donationDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.donationRecord.count({
        where: {
          profileId: user.profile.id,
          deletedAt: null,
        },
      }),
    ]);

    return {
      data: donations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get eligibility status for current user
   */
  async getEligibilityStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      throw new NotFoundException('User profile not found');
    }

    const profile = user.profile;

    // Check if donor is verified
    if (!profile.isDonorVerified) {
      return {
        isEligible: false,
        reason: 'not_verified',
        message: 'You must be verified by a medical center before donating',
        nextEligibleDate: null,
        daysUntilEligible: null,
      };
    }

    // Check if there's a next eligible date
    if (!profile.nextEligibleDate) {
      return {
        isEligible: true,
        reason: 'no_previous_donation',
        message: 'You are eligible to donate',
        nextEligibleDate: null,
        daysUntilEligible: 0,
      };
    }

    const now = new Date();
    const nextEligible = new Date(profile.nextEligibleDate);

    // Check if eligible
    if (now >= nextEligible) {
      return {
        isEligible: true,
        reason: 'eligible',
        message: 'You are eligible to donate',
        nextEligibleDate: profile.nextEligibleDate,
        daysUntilEligible: 0,
      };
    }

    // Calculate days until eligible
    const daysUntilEligible = Math.ceil((nextEligible.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      isEligible: false,
      reason: 'cooldown_period',
      message: `You must wait ${daysUntilEligible} more days before your next donation`,
      nextEligibleDate: profile.nextEligibleDate,
      daysUntilEligible,
      lastDonationDate: profile.lastDonationDate,
    };
  }

  /**
   * Get staff/admin profile
   */
  async getStaffProfile(userId: string) {
    const staff = await this.prisma.medicalCenterStaff.findUnique({
      where: { userId },
      include: {
        medicalCenter: {
          include: {
            organization: true,
          },
        },
        organization: true,
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff profile not found');
    }

    return { data: staff };
  }

  /**
   * Update staff/admin profile
   */
  async updateStaffProfile(userId: string, updateDto: any) {
    const staff = await this.prisma.medicalCenterStaff.findUnique({
      where: { userId },
    });

    if (!staff) {
      throw new NotFoundException('Staff profile not found');
    }

    const updated = await this.prisma.medicalCenterStaff.update({
      where: { userId },
      data: {
        firstName: updateDto.firstName,
        lastName: updateDto.lastName,
        phone: updateDto.phone,
        position: updateDto.position,
        licenseNumber: updateDto.licenseNumber,
      },
      include: {
        medicalCenter: {
          include: {
            organization: true,
          },
        },
        organization: true,
      },
    });

    return updated;
  }
}

