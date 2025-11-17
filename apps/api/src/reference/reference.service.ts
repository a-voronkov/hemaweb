import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReferenceService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all blood types
   */
  async getBloodTypes() {
    const bloodTypes = await this.prisma.bloodTypeRef.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        sortOrder: true,
      },
    });

    return { data: bloodTypes };
  }

  /**
   * Get all availability statuses
   */
  async getAvailabilityStatuses() {
    const statuses = await this.prisma.availabilityStatusRef.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        sortOrder: true,
      },
    });

    return { data: statuses };
  }

  /**
   * Get all user roles
   */
  async getUserRoles() {
    const roles = await this.prisma.userRoleRef.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        sortOrder: true,
      },
    });

    return { data: roles };
  }

  /**
   * Get all blood drive statuses
   */
  async getBloodDriveStatuses() {
    const statuses = await this.prisma.bloodDriveStatusRef.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        sortOrder: true,
      },
    });

    return { data: statuses };
  }

  /**
   * Get all blood drive types
   */
  async getBloodDriveTypes() {
    const types = await this.prisma.bloodDriveTypeRef.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        sortOrder: true,
      },
    });

    return { data: types };
  }

  /**
   * Get all notification types
   */
  async getNotificationTypes() {
    const types = await this.prisma.notificationTypeRef.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        sortOrder: true,
      },
    });

    return { data: types };
  }
}

