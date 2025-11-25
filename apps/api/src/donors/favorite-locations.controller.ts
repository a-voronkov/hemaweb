import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FavoriteLocationsService } from './favorite-locations.service';

@ApiTags('Donor Favorite Locations')
@Controller('donors/favorite-locations')
@UseGuards(AuthGuard, RolesGuard)
@Roles('donor')
@ApiBearerAuth()
export class FavoriteLocationsController {
  constructor(private favoriteLocationsService: FavoriteLocationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get my favorite locations (Donor only)' })
  @ApiResponse({ status: 200, description: 'Locations retrieved' })
  async getMyLocations(@CurrentUser() user: any) {
    return this.favoriteLocationsService.getLocations(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add favorite location (Donor only)' })
  @ApiResponse({ status: 201, description: 'Location added' })
  async addLocation(
    @CurrentUser() user: any,
    @Body()
    body: {
      name: string;
      latitude: number;
      longitude: number;
      radiusKm?: number;
    },
  ) {
    return this.favoriteLocationsService.addLocation(user.id, body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update favorite location (Donor only)' })
  @ApiResponse({ status: 200, description: 'Location updated' })
  async updateLocation(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      latitude?: number;
      longitude?: number;
      radiusKm?: number;
      isActive?: boolean;
    },
  ) {
    return this.favoriteLocationsService.updateLocation(user.id, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete favorite location (Donor only)' })
  @ApiResponse({ status: 200, description: 'Location deleted' })
  async deleteLocation(@CurrentUser() user: any, @Param('id') id: string) {
    return this.favoriteLocationsService.deleteLocation(user.id, id);
  }

  @Get('nearby-drives')
  @ApiOperation({
    summary: 'Get blood drives near favorite locations (Donor only)',
  })
  @ApiResponse({ status: 200, description: 'Nearby drives retrieved' })
  async getNearbyDrives(@CurrentUser() user: any) {
    return this.favoriteLocationsService.getNearbyDrives(user.id);
  }
}
