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

  @Get('me/staff-profile')
  @ApiOperation({ summary: 'Get current staff/admin profile' })
  @ApiResponse({ status: 200, description: 'Staff profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyStaffProfile(@CurrentUser() user: any) {
    return this.usersService.getStaffProfile(user.id);
  }

  @Put('me/staff-profile')
  @ApiOperation({ summary: 'Update current staff/admin profile' })
  @ApiResponse({ status: 200, description: 'Staff profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async updateMyStaffProfile(
    @CurrentUser() user: any,
    @Body() updateDto: any,
  ) {
    const updatedProfile = await this.usersService.updateStaffProfile(
      user.id,
      updateDto,
    );

    return {
      message: 'Staff profile updated successfully',
      data: updatedProfile,
    };
  }

  @Get('search')
  @UseGuards(RolesGuard)
  @Roles('admin', 'system_admin', 'staff', 'super_admin')
  @ApiOperation({ summary: 'Search users (staff/admin)' })
  @ApiQuery({ name: 'email', required: false, description: 'Email to search' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 10 })
  @ApiResponse({ status: 200, description: 'Users found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Staff access required' })
  async searchUsers(
    @Query('email') email: string,
    @Query('q') query: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<{
    data: any[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const searchQuery = email || query;
    if (!searchQuery) {
      return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
    }

    return this.usersService.searchUsers(
      searchQuery,
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

  @Get('me/donations')
  @ApiOperation({ summary: 'Get my donation history' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 20 })
  @ApiResponse({ status: 200, description: 'Donation history retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyDonationHistory(
    @CurrentUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.usersService.getMyDonationHistory(
      user.id,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get('me/eligibility')
  @ApiOperation({ summary: 'Get my donation eligibility status' })
  @ApiResponse({ status: 200, description: 'Eligibility status retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyEligibility(@CurrentUser() user: any) {
    return this.usersService.getEligibilityStatus(user.id);
  }
}

