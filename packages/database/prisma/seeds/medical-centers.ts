import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedMedicalCenters() {
  console.log('🏥 Seeding medical organizations and centers...');

  // Create test medical organization
  const org = await prisma.medicalOrganization.upsert({
    where: { id: 'test-org-1' },
    update: {},
    create: {
      id: 'test-org-1',
      name: 'Bangkok Medical Group',
      description: 'Leading healthcare provider in Bangkok',
      website: 'https://bangkokmedical.example.com',
      contactEmail: 'contact@bangkokmedical.example.com',
      contactPhone: '+66-2-123-4567',
      isActive: true,
    },
  });

  console.log(`✅ Created organization: ${org.name}`);

  // Create test medical centers
  const centers = [
    {
      id: 'test-center-1',
      organizationId: org.id,
      name: 'Bangkok Medical Center - Sukhumvit',
      code: 'BMC-SUK',
      address: '123 Sukhumvit Road, Khlong Toei, Bangkok 10110',
      city: 'Bangkok',
      province: 'Bangkok',
      postalCode: '10110',
      country: 'Thailand',
      locationLat: 13.7307,
      locationLng: 100.5418,
      phone: '+66-2-123-4501',
      email: 'sukhumvit@bangkokmedical.example.com',
      operatingHours: 'Mon-Fri: 8:00-20:00, Sat-Sun: 9:00-17:00',
      isActive: true,
    },
    {
      id: 'test-center-2',
      organizationId: org.id,
      name: 'Bangkok Medical Center - Silom',
      code: 'BMC-SIL',
      address: '456 Silom Road, Bang Rak, Bangkok 10500',
      city: 'Bangkok',
      province: 'Bangkok',
      postalCode: '10500',
      country: 'Thailand',
      locationLat: 13.7248,
      locationLng: 100.5346,
      phone: '+66-2-123-4502',
      email: 'silom@bangkokmedical.example.com',
      operatingHours: 'Mon-Fri: 8:00-20:00, Sat-Sun: 9:00-17:00',
      isActive: true,
    },
  ];

  for (const centerData of centers) {
    const center = await prisma.medicalCenter.upsert({
      where: { id: centerData.id },
      update: {},
      create: centerData,
    });
    console.log(`✅ Created medical center: ${center.name}`);
  }

  console.log('✅ Medical organizations and centers seeded!');
}

export async function seedStaffUsers() {
  console.log('👨‍⚕️ Seeding staff users...');

  const bcrypt = require('bcrypt');

  // Get roles
  const staffRole = await prisma.userRoleRef.findUnique({ where: { code: 'staff' } });
  const adminRole = await prisma.userRoleRef.findUnique({ where: { code: 'admin' } });
  const superAdminRole = await prisma.userRoleRef.findUnique({ where: { code: 'super_admin' } });

  if (!staffRole || !adminRole || !superAdminRole) {
    console.error('❌ Required roles not found');
    return;
  }

  // Create staff user
  const staffPassword = await bcrypt.hash('Staff123456', 10);
  const staff = await prisma.user.upsert({
    where: { email: 'staff@bangkokmedical.example.com' },
    update: {},
    create: {
      email: 'staff@bangkokmedical.example.com',
      passwordHash: staffPassword,
      roleId: staffRole.id,
      isVerified: true,
      isActive: true,
      medicalCenterStaff: {
        create: {
          firstName: 'John',
          lastName: 'Staff',
          phone: '+66-81-111-1111',
          medicalCenterId: 'test-center-1',
          position: 'Blood Bank Technician',
          licenseNumber: 'BT-12345',
        },
      },
    },
  });
  console.log(`✅ Created staff user: ${staff.email}`);

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bangkokmedical.example.com' },
    update: {},
    create: {
      email: 'admin@bangkokmedical.example.com',
      passwordHash: adminPassword,
      roleId: adminRole.id,
      isVerified: true,
      isActive: true,
      medicalCenterStaff: {
        create: {
          firstName: 'Jane',
          lastName: 'Admin',
          phone: '+66-81-222-2222',
          medicalCenterId: 'test-center-1',
          position: 'Blood Bank Manager',
          licenseNumber: 'BM-67890',
        },
      },
    },
  });
  console.log(`✅ Created admin user: ${admin.email}`);

  // Create super admin user
  const superAdminPassword = await bcrypt.hash('SuperAdmin123456', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@bangkokmedical.example.com' },
    update: {},
    create: {
      email: 'superadmin@bangkokmedical.example.com',
      passwordHash: superAdminPassword,
      roleId: superAdminRole.id,
      isVerified: true,
      isActive: true,
      medicalCenterStaff: {
        create: {
          firstName: 'Robert',
          lastName: 'SuperAdmin',
          phone: '+66-81-333-3333',
          organizationId: 'test-org-1',
          position: 'Director of Blood Services',
        },
      },
    },
  });
  console.log(`✅ Created super admin user: ${superAdmin.email}`);

  console.log('✅ Staff users seeded!');
}

