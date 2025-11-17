-- Seed medical organizations and centers

-- Insert medical organization
INSERT INTO medical_organizations (id, name, description, website, "contactEmail", "contactPhone", "isActive", "createdAt", "updatedAt")
VALUES (
  'org-thai-redcross',
  'Thai Red Cross Society',
  'National blood donation organization',
  'https://www.redcross.or.th',
  'info@redcross.or.th',
  '+66-2-256-4000',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert medical centers
INSERT INTO medical_centers (id, "organizationId", name, code, address, city, province, "postalCode", country, "locationLat", "locationLng", phone, email, "operatingHours", "isActive", "createdAt", "updatedAt")
VALUES
(
  'center-bangkok',
  'org-thai-redcross',
  'Bangkok Blood Center',
  'BKK01',
  '1871 Rama IV Rd, Pathum Wan',
  'Bangkok',
  'Bangkok',
  '10330',
  'Thailand',
  13.7307,
  100.5418,
  '+66-2-256-4000',
  'bangkok@redcross.or.th',
  'Mon-Fri: 08:00-17:00, Sat: 08:00-12:00',
  true,
  NOW(),
  NOW()
),
(
  'center-chiangmai',
  'org-thai-redcross',
  'Chiang Mai Blood Center',
  'CNX01',
  '110 Changklan Rd',
  'Chiang Mai',
  'Chiang Mai',
  '50100',
  'Thailand',
  18.7883,
  98.9853,
  '+66-53-270-444',
  'chiangmai@redcross.or.th',
  'Mon-Fri: 08:00-17:00',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Create staff users (password: Staff123!)
DO $$
DECLARE
  staff_role_id TEXT;
  admin_role_id TEXT;
  super_admin_role_id TEXT;
  system_admin_role_id TEXT;
  staff_user_id TEXT;
  admin_user_id TEXT;
  super_admin_user_id TEXT;
  system_admin_user_id TEXT;
BEGIN
  -- Get role IDs
  SELECT id INTO staff_role_id FROM user_role_ref WHERE code = 'staff';
  SELECT id INTO admin_role_id FROM user_role_ref WHERE code = 'admin';
  SELECT id INTO super_admin_role_id FROM user_role_ref WHERE code = 'super_admin';
  SELECT id INTO system_admin_role_id FROM user_role_ref WHERE code = 'system_admin';

  -- Create system admin user
  INSERT INTO users (id, email, "passwordHash", "roleId", "isVerified", "isActive", "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(),
    'sysadmin@hemaweb.world',
    '$2b$10$YourHashedPasswordHere', -- Replace with actual hash
    system_admin_role_id,
    true,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET "updatedAt" = NOW()
  RETURNING id INTO system_admin_user_id;

  -- Create system admin profile
  INSERT INTO system_admins (id, "userId", "firstName", "lastName", phone, "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(),
    system_admin_user_id,
    'System',
    'Administrator',
    '+66-2-000-0001',
    NOW(),
    NOW()
  )
  ON CONFLICT ("userId") DO NOTHING;

  -- Create staff user
  INSERT INTO users (id, email, "passwordHash", "roleId", "isVerified", "isActive", "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(),
    'staff@hemaweb.world',
    '$2b$10$YourHashedPasswordHere', -- Replace with actual hash
    staff_role_id,
    true,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET "updatedAt" = NOW()
  RETURNING id INTO staff_user_id;

  -- Create staff profile
  INSERT INTO medical_center_staff (id, "userId", "firstName", "lastName", phone, "medicalCenterId", position, "licenseNumber", "createdAt", "updatedAt")
  VALUES (
    gen_random_uuid(),
    staff_user_id,
    'Staff',
    'Member',
    '+66-81-111-1111',
    'center-bangkok',
    'Medical Technician',
    'MT-12345',
    NOW(),
    NOW()
  )
  ON CONFLICT ("userId") DO NOTHING;

END $$;

-- Show results
SELECT 'Medical Organizations:' as info, COUNT(*) as count FROM medical_organizations
UNION ALL
SELECT 'Medical Centers:', COUNT(*) FROM medical_centers
UNION ALL
SELECT 'Staff Users:', COUNT(*) FROM medical_center_staff;

