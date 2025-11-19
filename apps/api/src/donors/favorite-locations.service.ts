import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoriteLocationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get donor's favorite locations
   */
  async getLocations(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Donor profile not found');
    }

    const locations = await this.prisma.donorFavoriteLocation.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'desc' },
    });

    return { data: locations };
  }

  /**
   * Add favorite location
   */
  async addLocation(
    userId: string,
    data: {
      name: string;
      latitude: number;
      longitude: number;
      radiusKm?: number;
    },
  ) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Donor profile not found');
    }

    const location = await this.prisma.donorFavoriteLocation.create({
      data: {
        profileId: profile.id,
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        radiusKm: data.radiusKm || 5,
      },
    });

    return {
      message: 'Location added successfully',
      data: location,
    };
  }

  /**
   * Update favorite location
   */
  async updateLocation(
    userId: string,
    locationId: string,
    data: {
      name?: string;
      latitude?: number;
      longitude?: number;
      radiusKm?: number;
      isActive?: boolean;
    },
  ) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Donor profile not found');
    }

    // Verify ownership
    const location = await this.prisma.donorFavoriteLocation.findUnique({
      where: { id: locationId },
    });

    if (!location || location.profileId !== profile.id) {
      throw new ForbiddenException('Location not found or access denied');
    }

    const updated = await this.prisma.donorFavoriteLocation.update({
      where: { id: locationId },
      data,
    });

    return {
      message: 'Location updated successfully',
      data: updated,
    };
  }

  /**
   * Delete favorite location
   */
  async deleteLocation(userId: string, locationId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Donor profile not found');
    }

    // Verify ownership
    const location = await this.prisma.donorFavoriteLocation.findUnique({
      where: { id: locationId },
    });

    if (!location || location.profileId !== profile.id) {
      throw new ForbiddenException('Location not found or access denied');
    }

    await this.prisma.donorFavoriteLocation.delete({
      where: { id: locationId },
    });

    return {
      message: 'Location deleted successfully',
    };
  }

  /**
   * Get blood drives near favorite locations
   * Uses Haversine formula to calculate distance
   */
  async getNearbyDrives(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        favoriteLocations: {
          where: { isActive: true },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Donor profile not found');
    }

    if (profile.favoriteLocations.length === 0) {
      return { data: [] };
    }

    // Get upcoming blood drives with location data
    const bloodDrives = await this.prisma.bloodDrive.findMany({
      where: {
        deletedAt: null,
        startDateTime: {
          gte: new Date(),
        },
      },
      include: {
        medicalCenter: true,
        status: true,
      },
    });

    // Calculate distances and filter
    const drivesWithDistance = bloodDrives
      .map((drive) => {
        if (!drive.locationLat || !drive.locationLng) {
          return null;
        }

        // Find closest favorite location
        let minDistance = Infinity;
        let closestLocation = null;

        for (const loc of profile.favoriteLocations) {
          const distance = this.calculateDistance(
            loc.latitude,
            loc.longitude,
            drive.locationLat,
            drive.locationLng,
          );

          if (distance < minDistance) {
            minDistance = distance;
            closestLocation = loc;
          }
        }

        // Check if within radius
        if (closestLocation && minDistance <= closestLocation.radiusKm) {
          return {
            ...drive,
            distance: minDistance,
            walkingTimeMinutes: Math.round(minDistance * 12), // ~12 min per km walking
            nearestLocation: closestLocation.name,
          };
        }

        return null;
      })
      .filter((drive) => drive !== null)
      .sort((a, b) => a!.distance - b!.distance);

    return { data: drivesWithDistance };
  }

  /**
   * Calculate distance between two points using Haversine formula
   * Returns distance in kilometers
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
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
}

