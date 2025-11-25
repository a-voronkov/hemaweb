import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SystemAdminsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all system admins
   */
  async getAllSystemAdmins() {
    const systemAdminRole = await this.prisma.userRoleRef.findUnique({
      where: { code: 'system_admin' },
    });

    if (!systemAdminRole) {
      throw new NotFoundException('System admin role not found');
    }

    const admins = await this.prisma.user.findMany({
      where: {
        roleId: systemAdminRole.id,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        systemAdmin: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { data: admins };
  }

  /**
   * Create new system admin
   */
  async createSystemAdmin(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Get system admin role
    const role = await this.prisma.userRoleRef.findUnique({
      where: { code: 'system_admin' },
    });

    if (!role) {
      throw new NotFoundException('System admin role not found');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user and staff in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash: hashedPassword,
          roleId: role.id,
          isVerified: true,
          isActive: true,
        },
      });

      // Create staff profile (system admins don't belong to organization)
      const staff = await tx.medicalCenterStaff.create({
        data: {
          userId: user.id,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });

      return { user, staff };
    });

    return {
      message: 'System admin created successfully',
      data: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.staff.firstName,
        lastName: result.staff.lastName,
      },
    };
  }

  /**
   * Update system admin
   */
  async updateSystemAdmin(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      isActive?: boolean;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        systemAdmin: true,
      },
    });

    if (!user || !user.systemAdmin) {
      throw new NotFoundException('System admin not found');
    }

    // Update in transaction
    await this.prisma.$transaction(async (tx) => {
      // Update system admin profile
      if (data.firstName !== undefined || data.lastName !== undefined) {
        await tx.systemAdmin.update({
          where: { id: user.systemAdmin!.id },
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
        });
      }

      // Update user isActive if provided
      if (data.isActive !== undefined) {
        await tx.user.update({
          where: { id },
          data: { isActive: data.isActive },
        });
      }
    });

    return {
      message: 'System admin updated successfully',
    };
  }
}
