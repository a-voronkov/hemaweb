import { PrismaClient, BloodType, MedicalCenterRole, AvailabilityStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password helper
  const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10);
  };

  // 1. Create Medical Organization
  console.log('Creating medical organization...');
  const organization = await prisma.medicalOrganization.create({
    data: {
      name: 'Thai Red Cross Society',
      description: 'National blood donation organization',
      isActive: true,
    },
  });

  // 2. Create Medical Centers
  console.log('Creating medical centers...');
  const center1 = await prisma.medicalCenter.create({
    data: {
      organizationId: organization.id,
      name: 'Bangkok Blood Center',
      address: '1871 Rama IV Rd, Pathum Wan, Bangkok 10330',
      phone: '+66-2-256-4000',
      email: 'bangkok@redcross.or.th',
      isActive: true,
    },
  });

  const center2 = await prisma.medicalCenter.create({
    data: {
      organizationId: organization.id,
      name: 'Chiang Mai Blood Center',
      address: '110 Changklan Rd, Chiang Mai 50100',
      phone: '+66-53-270-444',
      email: 'chiangmai@redcross.or.th',
      isActive: true,
    },
  });

  // 3. Create Super Admin
  console.log('Creating super admin...');
  const superAdmin = await prisma.medicalCenterAccount.create({
    data: {
      email: 'superadmin@hemaweb.local',
      password: await hashPassword('SuperAdmin123!'),
      firstName: 'Super',
      lastName: 'Admin',
      role: MedicalCenterRole.SUPER_ADMIN,
      organizationId: organization.id,
      isActive: true,
    },
  });

  // 4. Create Admin for Center 1
  console.log('Creating admin...');
  const admin = await prisma.medicalCenterAccount.create({
    data: {
      email: 'admin@hemaweb.local',
      password: await hashPassword('Admin123!'),
      firstName: 'Admin',
      lastName: 'User',
      role: MedicalCenterRole.ADMIN,
      medicalCenterId: center1.id,
      isActive: true,
    },
  });

  // 5. Create Staff for Center 1
  console.log('Creating staff...');
  const staff = await prisma.medicalCenterAccount.create({
    data: {
      email: 'staff@hemaweb.local',
      password: await hashPassword('Staff123!'),
      firstName: 'Staff',
      lastName: 'User',
      role: MedicalCenterRole.STAFF,
      medicalCenterId: center1.id,
      isActive: true,
    },
  });

  // 6. Create System Admin
  console.log('Creating system admin...');
  const systemAdmin = await prisma.systemAdminAccount.create({
    data: {
      email: 'sysadmin@hemaweb.local',
      password: await hashPassword('SysAdmin123!'),
      firstName: 'System',
      lastName: 'Administrator',
      isActive: true,
    },
  });

  // 7. Create Donor Accounts
  console.log('Creating donor accounts...');
  const donor1 = await prisma.account.create({
    data: {
      email: 'donor1@example.com',
      password: await hashPassword('Donor123!'),
      phone: '+66-81-234-5678',
      profile: {
        create: {
          firstName: 'Somchai',
          lastName: 'Prasert',
          bloodType: BloodType.O_POSITIVE,
          isVerified: true,
          availabilityStatus: AvailabilityStatus.AVAILABLE,
        },
      },
    },
  });

  const donor2 = await prisma.account.create({
    data: {
      email: 'donor2@example.com',
      password: await hashPassword('Donor123!'),
      phone: '+66-81-234-5679',
      profile: {
        create: {
          firstName: 'Siriwan',
          lastName: 'Chaiyaporn',
          bloodType: BloodType.A_POSITIVE,
          isVerified: false,
          availabilityStatus: AvailabilityStatus.UNAVAILABLE,
        },
      },
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('Super Admin: superadmin@hemaweb.local / SuperAdmin123!');
  console.log('Admin: admin@hemaweb.local / Admin123!');
  console.log('Staff: staff@hemaweb.local / Staff123!');
  console.log('System Admin: sysadmin@hemaweb.local / SysAdmin123!');
  console.log('Donor 1 (verified): donor1@example.com / Donor123!');
  console.log('Donor 2 (unverified): donor2@example.com / Donor123!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

