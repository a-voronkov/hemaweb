import {
  Controller,
  Get,
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
import { SystemAdminsService } from './system-admins.service';

@ApiTags('System Admins')
@Controller('admin/system-admins')
@UseGuards(AuthGuard, RolesGuard)
@Roles('system_admin')
@ApiBearerAuth()
export class SystemAdminsController {
  constructor(private systemAdminsService: SystemAdminsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all system admins (System Admin only)' })
  @ApiResponse({ status: 200, description: 'System admins retrieved' })
  async getAllSystemAdmins() {
    return this.systemAdminsService.getAllSystemAdmins();
  }

  @Post()
  @ApiOperation({ summary: 'Create system admin (System Admin only)' })
  @ApiResponse({ status: 201, description: 'System admin created' })
  async createSystemAdmin(
    @Body() body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
  ) {
    return this.systemAdminsService.createSystemAdmin(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update system admin (System Admin only)' })
  @ApiResponse({ status: 200, description: 'System admin updated' })
  @ApiResponse({ status: 404, description: 'System admin not found' })
  async updateSystemAdmin(
    @Param('id') id: string,
    @Body() body: {
      firstName?: string;
      lastName?: string;
      isActive?: boolean;
    },
  ) {
    return this.systemAdminsService.updateSystemAdmin(id, body);
  }
}

