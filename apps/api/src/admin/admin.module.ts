import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SystemAdminsController } from './system-admins.controller';
import { SystemAdminsService } from './system-admins.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AdminController, SystemAdminsController],
  providers: [AdminService, SystemAdminsService],
  exports: [AdminService, SystemAdminsService],
})
export class AdminModule {}
