/**
 * Navigation Configuration
 * Defines menu items for different user roles
 */

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  description?: string;
}

export interface RoleNavigation {
  primary: NavItem[];
  secondary?: NavItem[];
}

export const navigationConfig: Record<string, RoleNavigation> = {
  // Donor Navigation
  donor: {
    primary: [
      {
        label: 'Dashboard',
        href: '/profile',
        description: 'Your profile and overview',
      },
      {
        label: 'Blood Drives',
        href: '/blood-drives',
        description: 'Find blood drives near you',
      },
      {
        label: 'My Donations',
        href: '/donations',
        description: 'View your donation history',
      },
      {
        label: 'Calendar',
        href: '/calendar',
        description: 'Your donation calendar',
      },
    ],
    secondary: [
      {
        label: 'Settings',
        href: '/settings/notifications',
        description: 'Notification preferences',
      },
    ],
  },

  // Staff Navigation
  staff: {
    primary: [
      {
        label: 'Dashboard',
        href: '/staff/dashboard',
        description: 'Staff dashboard',
      },
      {
        label: 'Verify Donor',
        href: '/staff/verify-donor',
        description: 'Verify donor eligibility',
      },
      {
        label: 'Record Donation',
        href: '/staff/record-donation',
        description: 'Record a donation',
      },
      {
        label: 'Donors',
        href: '/staff/donors',
        description: 'View donors',
      },
      {
        label: 'Blood Drives',
        href: '/staff/blood-drives',
        description: 'Manage blood drives',
      },
    ],
  },

  // Admin Navigation (Medical Center Admin)
  admin: {
    primary: [
      {
        label: 'Dashboard',
        href: '/staff/dashboard',
        description: 'Staff dashboard',
      },
      {
        label: 'Verify Donor',
        href: '/staff/verify-donor',
        description: 'Verify donor eligibility',
      },
      {
        label: 'Record Donation',
        href: '/staff/record-donation',
        description: 'Record a donation',
      },
      {
        label: 'Donors',
        href: '/staff/donors',
        description: 'View donors',
      },
      {
        label: 'Blood Drives',
        href: '/staff/blood-drives',
        description: 'Manage blood drives',
      },
    ],
  },

  // Super Admin Navigation (Organization-level)
  super_admin: {
    primary: [
      {
        label: 'Dashboard',
        href: '/admin',
        description: 'Organization dashboard',
      },
      {
        label: 'My Organization',
        href: '/super-admin/organization',
        description: 'Manage my organization',
      },
      {
        label: 'Medical Centers',
        href: '/super-admin/centers',
        description: 'Manage organization centers',
      },
      {
        label: 'Staff',
        href: '/staff/dashboard',
        description: 'Staff functions',
      },
    ],
  },

  // System Admin Navigation (Platform-level)
  system_admin: {
    primary: [
      {
        label: 'Dashboard',
        href: '/admin',
        description: 'System dashboard',
      },
      {
        label: 'Organizations',
        href: '/admin/organizations',
        description: 'Manage all organizations',
      },
    ],
  },

  // Guest Navigation (not logged in)
  guest: {
    primary: [
      {
        label: 'About',
        href: '/#about',
        description: 'Learn about HemaWeb',
      },
      {
        label: 'How It Works',
        href: '/#how-it-works',
        description: 'How blood donation works',
      },
    ],
  },
};

/**
 * Get navigation items for a specific role
 */
export function getNavigationForRole(roleCode?: string): RoleNavigation {
  if (!roleCode) {
    return navigationConfig.guest;
  }
  return navigationConfig[roleCode] || navigationConfig.guest;
}

