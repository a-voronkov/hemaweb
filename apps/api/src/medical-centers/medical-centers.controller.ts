import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MedicalCentersService } from './medical-centers.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Medical Centers')
@Controller('medical-centers')
export class MedicalCentersController {
  constructor(private medicalCentersService: MedicalCentersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all medical centers' })
  @ApiResponse({ status: 200, description: 'Medical centers retrieved' })
  async getAllCenters(): Promise<{ data: any[] }> {
    return this.medicalCentersService.getAllCenters();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medical center by ID' })
  @ApiResponse({ status: 200, description: 'Medical center retrieved' })
  @ApiResponse({ status: 404, description: 'Medical center not found' })
  async getCenterById(@Param('id') id: string): Promise<{ data: any }> {
    return this.medicalCentersService.getCenterById(id);
  }

  @Get('search/nearby')
  @ApiOperation({ summary: 'Search medical centers by location' })
  @ApiResponse({ status: 200, description: 'Nearby medical centers retrieved' })
  async searchNearby(
    @Body() body: { lat: number; lng: number; radiusKm?: number },
  ): Promise<{ data: any[] }> {
    return this.medicalCentersService.searchNearby(
      body.lat,
      body.lng,
      body.radiusKm || 10,
    );
  }

  @Post('verify-donor')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify a donor (staff/admin only)' })
  @ApiResponse({ status: 200, description: 'Donor verified successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async verifyDonor(
    @Request() req,
    @Body()
    body: {
      donorUserId: string;
      medicalCenterId: string;
      notes?: string;
    },
  ) {
    return this.medicalCentersService.verifyDonor(
      req.user.id,
      body.donorUserId,
      body.medicalCenterId,
      body.notes,
    );
  }

  @Post('record-donation')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Record a blood donation (staff/admin only)' })
  @ApiResponse({ status: 200, description: 'Donation recorded successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async recordDonation(
    @Request() req,
    @Body()
    body: {
      donorUserId: string;
      medicalCenterId: string;
      bloodTypeId: string;
      volumeMl: number;
      notes?: string;
    },
  ): Promise<{ message: string; donation: any }> {
    return this.medicalCentersService.recordDonation(
      req.user.id,
      body.donorUserId,
      body.medicalCenterId,
      body.bloodTypeId,
      body.volumeMl,
      body.notes,
    );
  }

  @Get('staff/my-center')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my medical center (staff/admin)' })
  @ApiResponse({ status: 200, description: 'Medical center retrieved' })
  async getMyCenterAsStaff(@Request() req): Promise<{ data: any }> {
    return this.medicalCentersService.getStaffCenter(req.user.id);
  }

  @Get('staff/donors')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get donors at my center (staff/admin)' })
  @ApiResponse({ status: 200, description: 'Donors retrieved' })
  async getCenterDonors(@Request() req) {
    return this.medicalCentersService.getCenterDonors(req.user.id);
  }

  @Get('staff/donations')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get donations at my center (staff/admin)' })
  @ApiResponse({ status: 200, description: 'Donations retrieved' })
  async getCenterDonations(@Request() req) {
    return this.medicalCentersService.getCenterDonations(req.user.id);
  }

  @Get('staff/dashboard/stats')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get staff dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStaffDashboardStats(@Request() req) {
    return this.medicalCentersService.getStaffDashboardStats(req.user.id);
  }

  // Admin endpoints
  @Post('admin/create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'system_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create medical center (Admin only)' })
  @ApiResponse({ status: 201, description: 'Medical center created' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async createCenter(
    @Body()
    body: {
      name: string;
      organizationId: string;
      address: string;
      city: string;
      phone?: string;
      email?: string;
      locationLat?: number;
      locationLng?: number;
    },
  ) {
    return this.medicalCentersService.createCenter(body);
  }

  @Put('admin/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'system_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update medical center (Admin only)' })
  @ApiResponse({ status: 200, description: 'Medical center updated' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Medical center not found' })
  async updateCenter(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      address?: string;
      city?: string;
      phone?: string;
      email?: string;
      locationLat?: number;
      locationLng?: number;
      isActive?: boolean;
    },
  ) {
    return this.medicalCentersService.updateCenter(id, body);
  }

  @Delete('admin/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'system_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete medical center (Admin only)' })
  @ApiResponse({ status: 200, description: 'Medical center deleted' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Medical center not found' })
  async deleteCenter(@Param('id') id: string) {
    return this.medicalCentersService.deleteCenter(id);
  }

  @Get('admin/organizations')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'super_admin', 'system_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all organizations (Admin only)' })
  @ApiResponse({ status: 200, description: 'Organizations retrieved' })
  async getAllOrganizations() {
    return this.medicalCentersService.getAllOrganizations();
  }
}
