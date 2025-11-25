import { Module } from '@nestjs/common';
import { BloodDrivesController } from './blood-drives.controller';
import { BloodDrivesService } from './blood-drives.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, AuthModule, EmailModule],
  controllers: [BloodDrivesController],
  providers: [BloodDrivesService],
  exports: [BloodDrivesService],
})
export class BloodDrivesModule {}
