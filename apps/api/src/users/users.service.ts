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
   * Search users (admin only)
   */
  async searchUsers(query: string, page: number = 1, limit: number = 10): Promise<{
    data: any[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { profile: { firstName: { contains: query, mode: 'insensitive' } } },
            { profile: { lastName: { contains: query, mode: 'insensitive' } } },
          ],
        },
        include: {
          profile: true,
          role: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({
        where: {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { profile: { firstName: { contains: query, mode: 'insensitive' } } },
            { profile: { lastName: { contains: query, mode: 'insensitive' } } },
          ],
        },
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
}

