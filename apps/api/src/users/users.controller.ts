import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyProfile(@CurrentUser() user: any) {
    return this.usersService.getMyProfile(user.id);
  }

  @Get('me/profile')
  @ApiOperation({ summary: 'Get current user detailed profile' })
  @ApiResponse({ status: 200, description: 'Detailed profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyDetailedProfile(@CurrentUser() user: any) {
    return this.usersService.getUserProfile(user.id);
  }

  @Put('me/profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async updateMyProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedProfile = await this.usersService.updateProfile(
      user.id,
      updateProfileDto,
    );

    return {
      message: 'Profile updated successfully',
      profile: updatedProfile,
    };
  }

  @Get('search')
  @UseGuards(RolesGuard)
  @Roles('admin', 'system_admin')
  @ApiOperation({ summary: 'Search users (admin only)' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiResponse({ status: 200, description: 'Users found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async searchUsers(
    @Query('q') query: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.usersService.searchUsers(
      query,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') userId: string, @CurrentUser() user: any) {
    return this.usersService.getUserById(userId, user.id);
  }

  @Get(':id/profile')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserProfileById(@Param('id') userId: string, @CurrentUser() user: any) {
    return this.usersService.getUserById(userId, user.id);
  }
}

