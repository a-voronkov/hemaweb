import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  bloodTypes,
  userRoles,
  bloodDriveStatuses,
  bloodDriveTypes,
  availabilityStatuses,
  notificationTypes,
} from './seeds/reference-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed (v2 schema)...\n');

  // Helper function
  const hashPassword = async (password: string) => bcrypt.hash(password, 10);

  // ============================================================================
  // 1. SEED REFERENCE TABLES
  // ============================================================================

  console.log('📚 Seeding reference tables...');

  // Blood Types
  console.log('  - Blood types...');
  for (const bt of bloodTypes) {
    await prisma.bloodTypeRef.upsert({
      where: { code: bt.code },
      update: {},
      create: bt,
    });
  }

  // User Roles
  console.log('  - User roles...');
  for (const role of userRoles) {
    await prisma.userRoleRef.upsert({
      where: { code: role.code },
      update: {},
      create: role,
    });
  }

  // Blood Drive Statuses
  console.log('  - Blood drive statuses...');
  for (const status of bloodDriveStatuses) {
    await prisma.bloodDriveStatusRef.upsert({
      where: { code: status.code },
      update: {},
      create: status,
    });
  }

  // Blood Drive Types
  console.log('  - Blood drive types...');
  for (const type of bloodDriveTypes) {
    await prisma.bloodDriveTypeRef.upsert({
      where: { code: type.code },
      update: {},
      create: type,
    });
  }

  // Availability Statuses
  console.log('  - Availability statuses...');
  for (const status of availabilityStatuses) {
    await prisma.availabilityStatusRef.upsert({
      where: { code: status.code },
      update: {},
      create: status,
    });
  }

  // Notification Types
  console.log('  - Notification types...');
  for (const type of notificationTypes) {
    await prisma.notificationTypeRef.upsert({
      where: { code: type.code },
      update: {},
      create: type,
    });
  }

  console.log('✅ Reference tables seeded\n');

  // Get reference IDs
  const donorRole = await prisma.userRoleRef.findUnique({ where: { code: 'donor' } });
  const staffRole = await prisma.userRoleRef.findUnique({ where: { code: 'staff' } });
  const adminRole = await prisma.userRoleRef.findUnique({ where: { code: 'admin' } });
  const superAdminRole = await prisma.userRoleRef.findUnique({ where: { code: 'super_admin' } });
  const systemAdminRole = await prisma.userRoleRef.findUnique({ where: { code: 'system_admin' } });

  const oPositive = await prisma.bloodTypeRef.findUnique({ where: { code: 'O+' } });
  const aPositive = await prisma.bloodTypeRef.findUnique({ where: { code: 'A+' } });
  const available = await prisma.availabilityStatusRef.findUnique({ where: { code: 'available' } });
  const unavailable = await prisma.availabilityStatusRef.findUnique({
    where: { code: 'unavailable' },
  });

  // ============================================================================
  // 2. CREATE MEDICAL ORGANIZATION
  // ============================================================================

  console.log('🏥 Creating medical organization...');
  const organization = await prisma.medicalOrganization.create({
    data: {
      name: 'Thai Red Cross Society',
      description: 'National blood donation organization',
      website: 'https://www.redcross.or.th',
      email: 'info@redcross.or.th',
      phone: '+66-2-256-4000',
      isActive: true,
    },
  });
  console.log(`✅ Created organization: ${organization.name}\n`);

  // ============================================================================
  // 3. CREATE MEDICAL CENTERS
  // ============================================================================

  console.log('🏥 Creating medical centers...');
  const center1 = await prisma.medicalCenter.create({
    data: {
      organizationId: organization.id,
      name: 'Bangkok Blood Center',
      code: 'BKK01',
      address: '1871 Rama IV Rd, Pathum Wan',
      city: 'Bangkok',
      country: 'Thailand',
      locationLat: 13.7307,
      locationLng: 100.5418,
      phone: '+66-2-256-4000',
      email: 'bangkok@redcross.or.th',
      operatingHours: {
        monday: '08:00-17:00',
        tuesday: '08:00-17:00',
        wednesday: '08:00-17:00',
        thursday: '08:00-17:00',
        friday: '08:00-17:00',
        saturday: '08:00-12:00',
        sunday: 'Closed',
      },
      isActive: true,
    },
  });

  const center2 = await prisma.medicalCenter.create({
    data: {
      organizationId: organization.id,
      name: 'Chiang Mai Blood Center',
      code: 'CNX01',
      address: '110 Changklan Rd',
      city: 'Chiang Mai',
      country: 'Thailand',
      locationLat: 18.7883,
      locationLng: 98.9853,
      phone: '+66-53-270-444',
      email: 'chiangmai@redcross.or.th',
      isActive: true,
    },
  });

  console.log(`✅ Created ${center1.name}`);
  console.log(`✅ Created ${center2.name}\n`);

  // ============================================================================
  // 4. CREATE USERS & PROFILES
  // ============================================================================

  console.log('👥 Creating users...');

  // System Admin
  const sysAdminUser = await prisma.user.create({
    data: {
      email: 'sysadmin@hemaweb.world',
      passwordHash: await hashPassword('SysAdmin123!'),
      roleId: systemAdminRole!.id,
      isActive: true,
      isVerified: true,
      systemAdmin: {
        create: {
          firstName: 'System',
          lastName: 'Administrator',
          phone: '+66-2-000-0001',
        },
      },
    },
  });
  console.log(`✅ Created system admin: ${sysAdminUser.email}`);

  // Super Admin
  const superAdminUser = await prisma.user.create({
    data: {
      email: 'superadmin@hemaweb.world',
      passwordHash: await hashPassword('SuperAdmin123!'),
      roleId: superAdminRole!.id,
      isActive: true,
      isVerified: true,
      medicalCenterStaff: {
        create: {
          firstName: 'Super',
          lastName: 'Admin',
          phone: '+66-2-000-0002',
          organizationId: organization.id,
          position: 'Organization Administrator',
        },
      },
    },
  });
  console.log(`✅ Created super admin: ${superAdminUser.email}`);

  // Admin (Center 1)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@hemaweb.world',
      passwordHash: await hashPassword('Admin123!'),
      roleId: adminRole!.id,
      isActive: true,
      isVerified: true,
      medicalCenterStaff: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          phone: '+66-2-000-0003',
          medicalCenterId: center1.id,
          position: 'Center Administrator',
        },
      },
    },
  });
  console.log(`✅ Created admin: ${adminUser.email}`);

  // Staff (Center 1)
  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@hemaweb.world',
      passwordHash: await hashPassword('Staff123!'),
      roleId: staffRole!.id,
      isActive: true,
      isVerified: true,
      medicalCenterStaff: {
        create: {
          firstName: 'Staff',
          lastName: 'Member',
          phone: '+66-2-000-0004',
          medicalCenterId: center1.id,
          position: 'Medical Technician',
          licenseNumber: 'MT-12345',
        },
      },
    },
  });
  console.log(`✅ Created staff: ${staffUser.email}`);

  // Donor 1 (Verified)
  const donor1User = await prisma.user.create({
    data: {
      email: 'donor1@example.com',
      passwordHash: await hashPassword('Donor123!'),
      roleId: donorRole!.id,
      isActive: true,
      isVerified: true,
      profile: {
        create: {
          firstName: 'Somchai',
          lastName: 'Prasert',
          phone: '+66-81-234-5678',
          dateOfBirth: new Date('1990-05-15'),
          bloodTypeId: oPositive!.id,
          availabilityStatusId: available!.id,
          isDonorVerified: true,
          locationLat: 13.7563,
          locationLng: 100.5018,
          address: '123 Sukhumvit Rd',
          city: 'Bangkok',
          country: 'Thailand',
        },
      },
    },
  });
  console.log(`✅ Created donor (verified): ${donor1User.email}`);

  // Donor 2 (Unverified)
  const donor2User = await prisma.user.create({
    data: {
      email: 'donor2@example.com',
      passwordHash: await hashPassword('Donor123!'),
      roleId: donorRole!.id,
      isActive: true,
      isVerified: true,
      profile: {
        create: {
          firstName: 'Siriwan',
          lastName: 'Chaiyaporn',
          phone: '+66-81-234-5679',
          dateOfBirth: new Date('1995-08-20'),
          bloodTypeId: aPositive!.id,
          availabilityStatusId: unavailable!.id,
          isDonorVerified: false,
          locationLat: 13.7563,
          locationLng: 100.5018,
          address: '456 Rama IV Rd',
          city: 'Bangkok',
          country: 'Thailand',
        },
      },
    },
  });
  console.log(`✅ Created donor (unverified): ${donor2User.email}\n`);

  // ============================================================================
  // 5. SUMMARY
  // ============================================================================

  console.log('✅ Database seeded successfully!\n');
  console.log('📋 Test Accounts:');
  console.log('━'.repeat(60));
  console.log('System Admin:  sysadmin@hemaweb.world    / SysAdmin123!');
  console.log('Super Admin:   superadmin@hemaweb.world  / SuperAdmin123!');
  console.log('Admin:         admin@hemaweb.world       / Admin123!');
  console.log('Staff:         staff@hemaweb.world       / Staff123!');
  console.log('Donor 1 (✓):   donor1@example.com        / Donor123!');
  console.log('Donor 2 (✗):   donor2@example.com        / Donor123!');
  console.log('━'.repeat(60));
  console.log('\n🌐 Domain: hemaweb.world');
  console.log('📍 Centers: Bangkok, Chiang Mai');
  console.log('🩸 Blood Types: 8 types loaded');
  console.log('👥 User Roles: 5 roles loaded\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
