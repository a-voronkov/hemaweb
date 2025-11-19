import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { StaffService } from './staff.service';

@ApiTags('Staff')
@Controller('staff')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Post('admin/create')
  @UseGuards(RolesGuard)
  @Roles('super_admin', 'system_admin')
  @ApiOperation({ summary: 'Create staff member (Super Admin/System Admin only)' })
  @ApiResponse({ status: 201, description: 'Staff member created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createStaff(
    @Body() body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      position?: string;
      roleCode: string;
      organizationId: string;
      medicalCenterId?: string;
    },
  ) {
    return this.staffService.createStaff(body);
  }

  @Put('admin/:id')
  @UseGuards(RolesGuard)
  @Roles('super_admin', 'system_admin')
  @ApiOperation({ summary: 'Update staff member (Super Admin/System Admin only)' })
  @ApiResponse({ status: 200, description: 'Staff member updated' })
  @ApiResponse({ status: 404, description: 'Staff member not found' })
  async updateStaff(
    @Param('id') id: string,
    @Body() body: {
      firstName?: string;
      lastName?: string;
      position?: string;
      isActive?: boolean;
    },
  ) {
    return this.staffService.updateStaff(id, body);
  }
}

