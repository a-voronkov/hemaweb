import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all organizations with counts
   */
  async getAllOrganizations() {
    const organizations = await this.prisma.medicalOrganization.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: {
            medicalCenters: true,
            staff: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return { data: organizations };
  }

  /**
   * Get organization by ID with details
   */
  async getOrganization(id: string) {
    const organization = await this.prisma.medicalOrganization.findUnique({
      where: { id, deletedAt: null },
      include: {
        medicalCenters: {
          where: { deletedAt: null },
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            phone: true,
            email: true,
            locationLat: true,
            locationLng: true,
            isActive: true,
          },
        },
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
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
        },
        _count: {
          select: {
            medicalCenters: true,
            staff: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return { data: organization };
  }

  /**
   * Create new organization
   */
  async createOrganization(data: {
    name: string;
    description?: string;
    email?: string;
    phone?: string;
    website?: string;
  }) {
    const organization = await this.prisma.medicalOrganization.create({
      data: {
        name: data.name,
        description: data.description,
        email: data.email,
        phone: data.phone,
        website: data.website,
        isActive: true,
      },
    });

    return {
      message: 'Organization created successfully',
      data: organization,
    };
  }

  /**
   * Update organization
   */
  async updateOrganization(
    id: string,
    data: {
      name?: string;
      description?: string;
      email?: string;
      phone?: string;
      website?: string;
      isActive?: boolean;
    },
  ) {
    const organization = await this.prisma.medicalOrganization.findUnique({
      where: { id, deletedAt: null },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const updated = await this.prisma.medicalOrganization.update({
      where: { id },
      data,
    });

    return {
      message: 'Organization updated successfully',
      data: updated,
    };
  }

  /**
   * Delete organization (soft delete)
   */
  async deleteOrganization(id: string) {
    const organization = await this.prisma.medicalOrganization.findUnique({
      where: { id, deletedAt: null },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Soft delete organization and all related centers
    await this.prisma.medicalOrganization.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    // Also soft delete all medical centers
    await this.prisma.medicalCenter.updateMany({
      where: { organizationId: id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    return {
      message: 'Organization and all associated centers deleted successfully',
    };
  }
}

