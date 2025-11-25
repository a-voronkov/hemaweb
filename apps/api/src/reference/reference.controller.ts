import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReferenceService } from './reference.service';

@ApiTags('Reference Data')
@Controller('reference')
export class ReferenceController {
  constructor(private referenceService: ReferenceService) {}

  @Get('blood-types')
  @ApiOperation({ summary: 'Get all blood types' })
  @ApiResponse({ status: 200, description: 'Blood types retrieved' })
  async getBloodTypes() {
    return this.referenceService.getBloodTypes();
  }

  @Get('availability-statuses')
  @ApiOperation({ summary: 'Get all availability statuses' })
  @ApiResponse({ status: 200, description: 'Availability statuses retrieved' })
  async getAvailabilityStatuses() {
    return this.referenceService.getAvailabilityStatuses();
  }

  @Get('user-roles')
  @ApiOperation({ summary: 'Get all user roles' })
  @ApiResponse({ status: 200, description: 'User roles retrieved' })
  async getUserRoles() {
    return this.referenceService.getUserRoles();
  }

  @Get('blood-drive-statuses')
  @ApiOperation({ summary: 'Get all blood drive statuses' })
  @ApiResponse({ status: 200, description: 'Blood drive statuses retrieved' })
  async getBloodDriveStatuses() {
    return this.referenceService.getBloodDriveStatuses();
  }

  @Get('blood-drive-types')
  @ApiOperation({ summary: 'Get all blood drive types' })
  @ApiResponse({ status: 200, description: 'Blood drive types retrieved' })
  async getBloodDriveTypes() {
    return this.referenceService.getBloodDriveTypes();
  }

  @Get('notification-types')
  @ApiOperation({ summary: 'Get all notification types' })
  @ApiResponse({ status: 200, description: 'Notification types retrieved' })
  async getNotificationTypes() {
    return this.referenceService.getNotificationTypes();
  }
}
