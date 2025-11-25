import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard/stats')
  @Roles('admin', 'super_admin', 'system_admin')
  @ApiOperation({ summary: 'Get dashboard statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/activity')
  @Roles('admin', 'super_admin', 'system_admin')
  @ApiOperation({ summary: 'Get recent activity (Admin only)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items',
    example: 20,
  })
  @ApiResponse({ status: 200, description: 'Activity retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getRecentActivity(@Query('limit') limit: string = '20') {
    return this.adminService.getRecentActivity(parseInt(limit, 10));
  }

  @Get('dashboard/global-stats')
  @Roles('system_admin')
  @ApiOperation({ summary: 'Get global statistics (System Admin only)' })
  @ApiResponse({ status: 200, description: 'Global statistics retrieved' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - System Admin access required',
  })
  async getGlobalStats() {
    return this.adminService.getGlobalStats();
  }
}
