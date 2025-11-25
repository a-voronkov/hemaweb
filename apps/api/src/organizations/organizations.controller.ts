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
import { OrganizationsService } from './organizations.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('system_admin')
  @ApiOperation({ summary: 'Get all organizations (System Admin only)' })
  @ApiResponse({ status: 200, description: 'Organizations retrieved' })
  async getAllOrganizations() {
    return this.organizationsService.getAllOrganizations();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('system_admin', 'super_admin')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiResponse({ status: 200, description: 'Organization retrieved' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async getOrganization(@Param('id') id: string) {
    return this.organizationsService.getOrganization(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('system_admin')
  @ApiOperation({ summary: 'Create organization (System Admin only)' })
  @ApiResponse({ status: 201, description: 'Organization created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createOrganization(
    @Body()
    body: {
      name: string;
      description?: string;
      email?: string;
      phone?: string;
      website?: string;
    },
  ) {
    return this.organizationsService.createOrganization(body);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('system_admin')
  @ApiOperation({ summary: 'Update organization (System Admin only)' })
  @ApiResponse({ status: 200, description: 'Organization updated' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async updateOrganization(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      email?: string;
      phone?: string;
      website?: string;
      isActive?: boolean;
    },
  ) {
    return this.organizationsService.updateOrganization(id, body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('system_admin')
  @ApiOperation({ summary: 'Delete organization (System Admin only)' })
  @ApiResponse({ status: 200, description: 'Organization deleted' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async deleteOrganization(@Param('id') id: string) {
    return this.organizationsService.deleteOrganization(id);
  }
}
