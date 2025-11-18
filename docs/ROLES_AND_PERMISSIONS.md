# Roles and Permissions - Detailed Guide

## Overview

HemaWeb implements a hierarchical role-based access control (RBAC) system with five distinct roles, each with specific permissions and scope of access.

## Role Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    System Admin                              │
│              (Platform-wide access)                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Super Admin                                 │
│         (Organization-wide access)                           │
│    Example: Thai Red Cross Society                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Admin                                    │
│           (Single Medical Center)                            │
│    Example: Bangkok Blood Center                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Staff                                    │
│           (Single Medical Center)                            │
│    Example: Bangkok Blood Center                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Donor                                    │
│              (Personal profile only)                         │
└─────────────────────────────────────────────────────────────┘
```

## Detailed Role Descriptions

### 1. Donor

**Scope**: Personal profile and donation history

**Permissions**:
- `view_blood_drives` - View available blood drives
- `view_own_profile` - View personal profile
- `update_own_profile` - Update personal information
- `view_own_donations` - View donation history

**Key Features**:
- Browse blood drives near their location
- View eligibility status and next donation date
- Manage notification preferences
- Download donation certificates
- View donation history

**Database Profile**: `profiles` table

---

### 2. Staff (Medical Center Staff)

**Scope**: Single medical center (assigned via `medicalCenterId`)

**Permissions**:
- `verify_donors` - Verify donor eligibility
- `record_donations` - Record blood donations
- `create_blood_drives` - Create blood drive events
- `view_center_records` - View records for their center
- `view_center_donors` - View donors at their center

**Key Features**:
- Verify donors when they arrive
- Record donations and set cooldown periods
- Create blood drives for their center
- View verification and donation records for their center only
- Send emergency alerts for specific blood types

**Database Profile**: `medical_center_staff` table with `medicalCenterId` set

**Access Control**:
```typescript
// Staff can only access data from their assigned center
if (staff.medicalCenterId !== requestedCenterId) {
  throw new ForbiddenException('Access denied');
}
```

---

### 3. Admin (Medical Center Administrator)

**Scope**: Single medical center (assigned via `medicalCenterId`)

**Permissions**: All Staff permissions PLUS:
- `manage_staff` - Manage staff accounts at their center
- `view_center_analytics` - View analytics for their center

**Key Features**:
- All staff capabilities
- Create/edit/delete staff accounts for their center
- View activity logs for all staff at their center
- View center-level analytics and reports

**Database Profile**: `medical_center_staff` table with `medicalCenterId` set

**Access Control**: Same as Staff - limited to their assigned center

---

### 4. Super Admin (Organization Super Administrator)

**Scope**: Entire medical organization (assigned via `organizationId`)

**Permissions**:
- `verify_donors` - Verify donors at any center
- `record_donations` - Record donations at any center
- `create_blood_drives` - Create blood drives at any center
- `view_org_records` - View records across all centers in organization
- `view_org_donors` - View donors across all centers
- `manage_staff` - Manage staff at any center in organization
- `manage_admins` - Manage admin accounts
- `manage_centers` - Create/edit/delete medical centers
- `view_org_analytics` - View organization-wide analytics

**Key Features**:
- Manage multiple medical centers under their organization
- Create new medical centers
- Assign admins to centers
- View aggregated data across all centers
- Manage staff and admins across the organization

**Database Profile**: `medical_center_staff` table with:
- `organizationId` set
- `medicalCenterId` = NULL (not tied to specific center)

**Example Organization Structure**:
```
Thai Red Cross Society (Organization)
├── Bangkok Blood Center
│   ├── Admin: John Doe
│   └── Staff: Jane Smith, Bob Wilson
├── Chiang Mai Blood Center
│   ├── Admin: Alice Brown
│   └── Staff: Charlie Davis
└── Phuket Blood Center
    ├── Admin: David Lee
    └── Staff: Emma White
```

**Access Control**:
```typescript
// Super Admin can access all centers in their organization
const centers = await prisma.medicalCenter.findMany({
  where: { organizationId: superAdmin.organizationId }
});
```

---

### 5. System Admin (Platform Administrator)

**Scope**: Entire HemaWeb platform

**Permissions**:
- `manage_organizations` - Create/edit/delete medical organizations
- `manage_super_admins` - Manage super admin accounts
- `manage_content` - Manage educational content
- `suspend_users` - Suspend/unsuspend user accounts
- `view_system_analytics` - View platform-wide analytics
- `manage_reference_data` - Manage blood types, statuses, etc.

**Key Features**:
- Onboard new medical organizations
- Create super admin accounts for organizations
- Manage platform-wide content and settings
- Suspend problematic users
- View system-wide analytics

**Database Profile**: `system_admins` table

**Access Control**: Full platform access, no restrictions

---

## Medical Organization Structure

### Database Schema

```sql
medical_organizations
├── id (primary key)
├── name
├── description
├── logoUrl
├── website
├── email
├── phone
└── isActive

medical_centers
├── id (primary key)
├── organizationId (foreign key → medical_organizations)
├── name
├── address
├── city
├── locationLat/Lng
└── isActive

medical_center_staff
├── id (primary key)
├── userId (foreign key → users)
├── medicalCenterId (NULL for Super Admins)
├── organizationId (for Super Admins)
├── firstName
├── lastName
└── position
```

### Relationship Rules

1. **One Organization → Many Centers**
   - An organization can have multiple medical centers
   - Example: Thai Red Cross has centers in Bangkok, Chiang Mai, Phuket

2. **One Center → Many Staff/Admins**
   - Each center can have multiple staff and admin users
   - Staff and Admins are tied to exactly one center

3. **One Organization → Many Super Admins**
   - An organization can have multiple super admins
   - Super Admins are NOT tied to a specific center

4. **Cascade Deletion**
   - Deleting an organization deletes all its centers
   - Deleting a center deletes all its staff/admin accounts

---

## Access Control Implementation

### Role-Based Guards

```typescript
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin', 'super_admin', 'system_admin')
async createCenter() {
  // Only admins and above can create centers
}
```

### Data Filtering by Role

**Staff/Admin** (Center-level):
```typescript
const donations = await prisma.donationRecord.findMany({
  where: {
    medicalCenterId: staff.medicalCenterId // Limited to their center
  }
});
```

**Super Admin** (Organization-level):
```typescript
const centers = await prisma.medicalCenter.findMany({
  where: {
    organizationId: superAdmin.organizationId
  }
});

const donations = await prisma.donationRecord.findMany({
  where: {
    medicalCenter: {
      organizationId: superAdmin.organizationId // All centers in org
    }
  }
});
```

**System Admin** (Platform-level):
```typescript
const allOrganizations = await prisma.medicalOrganization.findMany();
// No restrictions
```

---

## Common Scenarios

### Scenario 1: New Organization Onboarding

1. **System Admin** creates a new Medical Organization
2. **System Admin** creates a Super Admin account for the organization
3. **Super Admin** creates medical centers under the organization
4. **Super Admin** creates Admin accounts for each center
5. **Admins** create Staff accounts for their centers

### Scenario 2: Multi-Center Blood Drive

1. **Super Admin** creates a blood drive across multiple centers
2. **Staff** at each center can see and manage the drive
3. **Super Admin** can view aggregated results across all centers

### Scenario 3: Staff Transfer

1. **Admin** at Center A removes staff member
2. **Admin** at Center B creates new staff account
3. Staff member gets new credentials for Center B

---

## Security Considerations

1. **Row-Level Security**: All queries filter by `medicalCenterId` or `organizationId`
2. **Soft Deletes**: Use `deletedAt` field instead of hard deletes
3. **Audit Logs**: All admin actions are logged
4. **Session-Based Auth**: Secure session management with HTTP-only cookies
5. **Permission Checks**: Every endpoint validates user role and permissions

---

## Future Enhancements

- [ ] Fine-grained permissions (e.g., `can_delete_donations`)
- [ ] Role delegation (temporary elevated permissions)
- [ ] Multi-organization support for System Admins
- [ ] Custom roles per organization
- [ ] Permission inheritance and overrides

