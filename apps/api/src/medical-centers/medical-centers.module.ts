import { Module } from '@nestjs/common';
import { MedicalCentersController } from './medical-centers.controller';
import { MedicalCentersService } from './medical-centers.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MedicalCentersController],
  providers: [MedicalCentersService],
  exports: [MedicalCentersService],
})
export class MedicalCentersModule {}

