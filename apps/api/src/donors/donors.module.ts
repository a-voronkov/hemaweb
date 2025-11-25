import { Module } from '@nestjs/common';
import { DonorsController } from './donors.controller';
import { DonorsService } from './donors.service';
import { FavoriteLocationsController } from './favorite-locations.controller';
import { FavoriteLocationsService } from './favorite-locations.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [DonorsController, FavoriteLocationsController],
  providers: [DonorsService, FavoriteLocationsService],
  exports: [DonorsService, FavoriteLocationsService],
})
export class DonorsModule {}

