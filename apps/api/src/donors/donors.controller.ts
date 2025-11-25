import { Controller, Get, UseGuards } from '@nestjs/common';
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
import { DonorsService } from './donors.service';

@ApiTags('Donors')
@Controller('donors')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class DonorsController {
  constructor(private donorsService: DonorsService) {}

  @Get('me/stats')
  @Roles('donor')
  @ApiOperation({ summary: 'Get donor statistics (Donor only)' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getMyStats(@CurrentUser() user: any) {
    return this.donorsService.getDonorStats(user.id);
  }

  @Get('me/donations')
  @Roles('donor')
  @ApiOperation({ summary: 'Get my donation history (Donor only)' })
  @ApiResponse({ status: 200, description: 'Donations retrieved' })
  async getMyDonations(@CurrentUser() user: any) {
    return this.donorsService.getDonorDonations(user.id);
  }

  @Get('me/achievements')
  @Roles('donor')
  @ApiOperation({ summary: 'Get my achievements (Donor only)' })
  @ApiResponse({ status: 200, description: 'Achievements retrieved' })
  async getMyAchievements(@CurrentUser() user: any) {
    return this.donorsService.getDonorAchievements(user.id);
  }
}
