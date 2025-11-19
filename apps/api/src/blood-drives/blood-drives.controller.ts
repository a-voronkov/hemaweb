import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BloodDrivesService } from './blood-drives.service';
import { CreateBloodDriveDto } from './dto/create-blood-drive.dto';
import { UpdateBloodDriveDto } from './dto/update-blood-drive.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Blood Drives')
@Controller('blood-drives')
export class BloodDrivesController {
  constructor(private bloodDrivesService: BloodDrivesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all blood drives' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by type' })
  @ApiResponse({ status: 200, description: 'Blood drives retrieved' })
  async getAllBloodDrives(
    @Query('status') status?: string,
    @Query('type') type?: string,
  ): Promise<{ data: any[] }> {
    return this.bloodDrivesService.getAllBloodDrives(status, type);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming blood drives' })
  @ApiResponse({ status: 200, description: 'Upcoming blood drives retrieved' })
  async getUpcomingBloodDrives(): Promise<{ data: any[] }> {
    return this.bloodDrivesService.getUpcomingBloodDrives();
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get nearby blood drives' })
  @ApiQuery({ name: 'lat', required: true, description: 'Latitude' })
  @ApiQuery({ name: 'lng', required: true, description: 'Longitude' })
  @ApiQuery({ name: 'radius', required: false, description: 'Radius in km (default: 50)' })
  @ApiQuery({ name: 'bloodType', required: false, description: 'Filter by blood type' })
  @ApiResponse({ status: 200, description: 'Nearby blood drives retrieved' })
  async getNearbyBloodDrives(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
    @Query('bloodType') bloodType?: string,
  ): Promise<{ data: any[] }> {
    return this.bloodDrivesService.getNearbyBloodDrives(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 50,
      bloodType,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blood drive by ID' })
  @ApiResponse({ status: 200, description: 'Blood drive retrieved' })
  @ApiResponse({ status: 404, description: 'Blood drive not found' })
  async getBloodDriveById(@Param('id') id: string): Promise<{ data: any }> {
    return this.bloodDrivesService.getBloodDriveById(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('staff', 'admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create blood drive (staff/admin only)' })
  @ApiResponse({ status: 201, description: 'Blood drive created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createBloodDrive(
    @Request() req,
    @Body() createBloodDriveDto: CreateBloodDriveDto,
  ): Promise<{ message: string; data: any }> {
    return this.bloodDrivesService.createBloodDrive(req.user.id, createBloodDriveDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('staff', 'admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blood drive (staff/admin only)' })
  @ApiResponse({ status: 200, description: 'Blood drive updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Blood drive not found' })
  async updateBloodDrive(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBloodDriveDto: UpdateBloodDriveDto,
  ): Promise<{ message: string; data: any }> {
    return this.bloodDrivesService.updateBloodDrive(req.user.id, id, updateBloodDriveDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('staff', 'admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blood drive (staff/admin only)' })
  @ApiResponse({ status: 200, description: 'Blood drive deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Blood drive not found' })
  async deleteBloodDrive(
    @Request() req,
    @Param('id') id: string,
  ) {
    return this.bloodDrivesService.deleteBloodDrive(req.user.id, id);
  }

  @Get('center/:centerId')
  @ApiOperation({ summary: 'Get blood drives by medical center' })
  @ApiResponse({ status: 200, description: 'Blood drives retrieved' })
  async getBloodDrivesByCenter(@Param('centerId') centerId: string) {
    return this.bloodDrivesService.getBloodDrivesByCenter(centerId);
  }

  @Post(':id/register')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register for blood drive (donors only)' })
  @ApiResponse({ status: 200, description: 'Registered successfully' })
  @ApiResponse({ status: 400, description: 'Already registered or not eligible' })
  async registerForBloodDrive(
    @Request() req,
    @Param('id') id: string,
  ) {
    return this.bloodDrivesService.registerForBloodDrive(req.user.id, id);
  }

  @Delete(':id/register')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel blood drive registration' })
  @ApiResponse({ status: 200, description: 'Registration cancelled' })
  async cancelRegistration(
    @Request() req,
    @Param('id') id: string,
  ) {
    return this.bloodDrivesService.cancelRegistration(req.user.id, id);
  }

  @Get(':id/registrations')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('staff', 'admin', 'super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get blood drive registrations (staff/admin only)' })
  @ApiResponse({ status: 200, description: 'Registrations retrieved' })
  async getBloodDriveRegistrations(@Param('id') id: string) {
    return this.bloodDrivesService.getBloodDriveRegistrations(id);
  }

  @Post('appointments')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('donor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Book appointment for blood drive (Donor only)' })
  @ApiResponse({ status: 201, description: 'Appointment booked' })
  @ApiResponse({ status: 400, description: 'Not eligible or drive is full' })
  async bookAppointment(
    @Request() req,
    @Body() body: { bloodDriveId: string; appointmentDate: string },
  ) {
    return this.bloodDrivesService.bookAppointment(req.user.id, body.bloodDriveId, body.appointmentDate);
  }
}

