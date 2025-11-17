// Reference data (справочники) для HemaWeb
// Эти данные должны быть загружены первыми при инициализации БД

export const bloodTypes = [
  { code: 'O+', name: 'O Positive', sortOrder: 1 },
  { code: 'O-', name: 'O Negative', sortOrder: 2 },
  { code: 'A+', name: 'A Positive', sortOrder: 3 },
  { code: 'A-', name: 'A Negative', sortOrder: 4 },
  { code: 'B+', name: 'B Positive', sortOrder: 5 },
  { code: 'B-', name: 'B Negative', sortOrder: 6 },
  { code: 'AB+', name: 'AB Positive', sortOrder: 7 },
  { code: 'AB-', name: 'AB Negative', sortOrder: 8 },
];

export const userRoles = [
  {
    code: 'donor',
    name: 'Donor',
    description: 'Blood donor user',
    permissions: ['view_blood_drives', 'view_own_profile', 'update_own_profile', 'view_own_donations'],
    sortOrder: 1,
  },
  {
    code: 'staff',
    name: 'Medical Center Staff',
    description: 'Medical center staff member',
    permissions: [
      'verify_donors',
      'record_donations',
      'create_blood_drives',
      'view_center_records',
      'view_center_donors',
    ],
    sortOrder: 2,
  },
  {
    code: 'admin',
    name: 'Medical Center Admin',
    description: 'Medical center administrator',
    permissions: [
      'verify_donors',
      'record_donations',
      'create_blood_drives',
      'view_center_records',
      'view_center_donors',
      'manage_staff',
      'view_center_analytics',
    ],
    sortOrder: 3,
  },
  {
    code: 'super_admin',
    name: 'Organization Super Admin',
    description: 'Medical organization super administrator',
    permissions: [
      'verify_donors',
      'record_donations',
      'create_blood_drives',
      'view_org_records',
      'view_org_donors',
      'manage_staff',
      'manage_admins',
      'manage_centers',
      'view_org_analytics',
    ],
    sortOrder: 4,
  },
  {
    code: 'system_admin',
    name: 'System Administrator',
    description: 'Platform system administrator',
    permissions: [
      'manage_organizations',
      'manage_super_admins',
      'manage_content',
      'suspend_users',
      'view_system_analytics',
      'manage_reference_data',
    ],
    sortOrder: 5,
  },
];

export const bloodDriveStatuses = [
  { code: 'upcoming', name: 'Upcoming', description: 'Blood drive is scheduled', sortOrder: 1 },
  { code: 'active', name: 'Active', description: 'Blood drive is currently active', sortOrder: 2 },
  { code: 'completed', name: 'Completed', description: 'Blood drive has been completed', sortOrder: 3 },
  { code: 'cancelled', name: 'Cancelled', description: 'Blood drive has been cancelled', sortOrder: 4 },
];

export const bloodDriveTypes = [
  { code: 'scheduled', name: 'Scheduled', description: 'Regular scheduled blood drive', sortOrder: 1 },
  { code: 'emergency', name: 'Emergency', description: 'Emergency blood drive', sortOrder: 2 },
];

export const availabilityStatuses = [
  {
    code: 'available',
    name: 'Available',
    description: 'Donor is available for donation',
    sortOrder: 1,
  },
  {
    code: 'emergencies_only',
    name: 'Emergencies Only',
    description: 'Donor is available only for emergency requests',
    sortOrder: 2,
  },
  {
    code: 'unavailable',
    name: 'Unavailable',
    description: 'Donor is not available for donation',
    sortOrder: 3,
  },
];

export const notificationTypes = [
  {
    code: 'blood_drive_alert',
    name: 'Blood Drive Alert',
    description: 'Notification about nearby blood drive matching donor blood type',
    template: 'blood_drive_alert',
    sortOrder: 1,
  },
  {
    code: 'donation_confirmation',
    name: 'Donation Confirmation',
    description: 'Confirmation after successful blood donation',
    template: 'donation_confirmation',
    sortOrder: 2,
  },
  {
    code: 'verification_complete',
    name: 'Verification Complete',
    description: 'Notification when donor verification is complete',
    template: 'verification_complete',
    sortOrder: 3,
  },
  {
    code: 'cooldown_reminder',
    name: 'Cooldown Reminder',
    description: 'Reminder when donor is eligible to donate again',
    template: 'cooldown_reminder',
    sortOrder: 4,
  },
  {
    code: 'general',
    name: 'General Notification',
    description: 'General system notification',
    template: 'general',
    sortOrder: 5,
  },
];

