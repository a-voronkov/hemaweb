import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create new staff member
   */
  async createStaff(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    position?: string;
    roleCode: string;
    organizationId: string;
    medicalCenterId?: string;
  }) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Get role
    const role = await this.prisma.userRoleRef.findUnique({
      where: { code: data.roleCode },
    });

    if (!role) {
      throw new BadRequestException('Invalid role code');
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
          isVerified: true, // Auto-verify staff emails
          isActive: true,
        },
      });

      // Create staff profile
      const staff = await tx.medicalCenterStaff.create({
        data: {
          userId: user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          position: data.position,
          organizationId: data.organizationId,
          medicalCenterId: data.medicalCenterId,
        },
        include: {
          user: {
            select: {
              email: true,
              role: {
                select: {
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
      });

      return staff;
    });

    return {
      message: 'Staff member created successfully',
      data: result,
    };
  }

  /**
   * Update staff member
   */
  async updateStaff(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      position?: string;
      isActive?: boolean;
    },
  ) {
    const staff = await this.prisma.medicalCenterStaff.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    // Update in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Update staff profile
      const updatedStaff = await tx.medicalCenterStaff.update({
        where: { id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          position: data.position,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              isActive: true,
              role: {
                select: {
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
      });

      // Update user isActive if provided
      if (data.isActive !== undefined) {
        await tx.user.update({
          where: { id: staff.userId },
          data: { isActive: data.isActive },
        });
      }

      return updatedStaff;
    });

    return {
      message: 'Staff member updated successfully',
      data: result,
    };
  }
}

