# Medical Organizations - Architecture and Implementation

## Overview

HemaWeb supports a multi-tenant architecture where multiple medical organizations can operate independently on the same platform. Each organization can manage multiple medical centers, creating a hierarchical structure.

## Organizational Hierarchy

```
Platform (HemaWeb)
│
├── Medical Organization 1 (e.g., Thai Red Cross Society)
│   ├── Medical Center 1.1 (e.g., Bangkok Blood Center)
│   │   ├── Admin
│   │   └── Staff Members
│   ├── Medical Center 1.2 (e.g., Chiang Mai Blood Center)
│   │   ├── Admin
│   │   └── Staff Members
│   └── Super Admin (manages all centers in org)
│
├── Medical Organization 2 (e.g., Bumrungrad Hospital Group)
│   ├── Medical Center 2.1
│   └── Medical Center 2.2
│
└── System Admin (manages all organizations)
```

## Database Schema

### Medical Organization

```typescript
model MedicalOrganization {
  id          String    @id @default(cuid())
  name        String    // e.g., "Thai Red Cross Society"
  description String?
  logoUrl     String?
  website     String?
  email       String?
  phone       String?
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime? // Soft delete

  // Relations
  medicalCenters MedicalCenter[]      // One-to-many
  staff          MedicalCenterStaff[] // Super Admins
}
```

**Key Fields**:
- `id`: Unique identifier
- `name`: Organization name (e.g., "Thai Red Cross Society")
- `isActive`: Soft enable/disable without deletion
- `deletedAt`: Soft delete timestamp

### Medical Center

```typescript
model MedicalCenter {
  id             String    @id @default(cuid())
  organizationId String    // Foreign key to organization
  name           String    // e.g., "Bangkok Blood Center"
  code           String?   @unique // Short code (e.g., "BKK-BC")
  address        String
  city           String
  country        String    @default("Thailand")
  locationLat    Float?
  locationLng    Float?
  phone          String?
  email          String?
  logoUrl        String?
  website        String?
  operatingHours Json?     // { "monday": "08:00-17:00", ... }
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  deletedAt      DateTime? // Soft delete

  // Relations
  organization        MedicalOrganization    @relation(...)
  staff               MedicalCenterStaff[]   // Admins and Staff
  bloodDrives         BloodDrive[]
  verificationRecords VerificationRecord[]
  donationRecords     DonationRecord[]
}
```

**Key Fields**:
- `organizationId`: Links center to parent organization
- `code`: Optional short code for easy reference
- `locationLat/Lng`: GPS coordinates for mapping
- `operatingHours`: JSON object with schedule

### Staff Assignment

```typescript
model MedicalCenterStaff {
  id              String    @id @default(cuid())
  userId          String    @unique
  firstName       String
  lastName        String
  phone           String?
  medicalCenterId String?   // NULL for Super Admins
  organizationId  String?   // Set for Super Admins
  position        String?
  licenseNumber   String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  user            User               @relation(...)
  medicalCenter   MedicalCenter?     @relation(...)
  organization    MedicalOrganization? @relation(...)
}
```

**Assignment Rules**:
- **Staff/Admin**: `medicalCenterId` is set, `organizationId` is NULL
- **Super Admin**: `organizationId` is set, `medicalCenterId` is NULL
- **Constraint**: Exactly one of `medicalCenterId` or `organizationId` must be set

## Real-World Examples

### Example 1: Thai Red Cross Society

**Organization**: Thai Red Cross Society
- **Website**: https://www.redcross.or.th
- **Description**: National blood service provider

**Medical Centers**:
1. **Bangkok Blood Center**
   - Address: 1871 Henri Dunant Road, Bangkok
   - Staff: 15 staff members, 2 admins
   - Services: Blood donation, testing, storage

2. **Chiang Mai Blood Center**
   - Address: 110 Changklan Road, Chiang Mai
   - Staff: 8 staff members, 1 admin
   - Services: Blood donation, mobile drives

3. **Phuket Blood Center**
   - Address: 44 Thepkasattri Road, Phuket
   - Staff: 6 staff members, 1 admin
   - Services: Blood donation, emergency supply

**Super Admin**: Dr. Somchai Pattana
- Role: Director of Blood Services
- Access: All 3 centers
- Responsibilities: Organization-wide policy, resource allocation

### Example 2: Bumrungrad Hospital

**Organization**: Bumrungrad International Hospital
- **Website**: https://www.bumrungrad.com
- **Description**: Private hospital group

**Medical Centers**:
1. **Bumrungrad Main Hospital**
   - Address: 33 Sukhumvit 3, Bangkok
   - Staff: 20 staff members, 3 admins

2. **Bumrungrad Wellness Center**
   - Address: 9 Sukhumvit 1, Bangkok
   - Staff: 5 staff members, 1 admin

## Data Isolation and Access Control

### Data Scoping by Role

| Role | Data Scope | Example Query |
|------|------------|---------------|
| **System Admin** | All organizations | `SELECT * FROM medical_organizations` |
| **Super Admin** | All centers in org | `WHERE organizationId = 'org-123'` |
| **Admin** | Single center | `WHERE medicalCenterId = 'center-456'` |
| **Staff** | Single center | `WHERE medicalCenterId = 'center-456'` |
| **Donor** | Own profile only | `WHERE userId = 'user-789'` |

### Implementation Pattern

```typescript
// Get user's scope
const staff = await prisma.medicalCenterStaff.findUnique({
  where: { userId },
  include: { user: { include: { role: true } } },
});

// Build where clause based on role
let whereClause: any = { deletedAt: null };

if (staff.user.role.code === 'super_admin') {
  // Super Admin: all centers in organization
  whereClause.medicalCenter = {
    organizationId: staff.organizationId,
  };
} else if (staff.user.role.code === 'admin' || staff.user.role.code === 'staff') {
  // Admin/Staff: single center
  whereClause.medicalCenterId = staff.medicalCenterId;
}

// Execute query with scoped data
const donations = await prisma.donationRecord.findMany({
  where: whereClause,
});
```

## Organization Management

### Creating a New Organization

**Who**: System Admin only

**Process**:
1. System Admin creates organization record
2. System Admin creates Super Admin account
3. Super Admin creates medical centers
4. Super Admin assigns Admins to centers
5. Admins create Staff accounts

**API Endpoint**:
```typescript
POST /api/organizations
{
  "name": "Thai Red Cross Society",
  "description": "National blood service provider",
  "email": "info@redcross.or.th",
  "phone": "+66-2-256-4444",
  "website": "https://www.redcross.or.th"
}
```

### Adding a Medical Center

**Who**: Super Admin or System Admin

**Process**:
1. Super Admin selects their organization
2. Fills in center details (name, address, location)
3. System creates center record
4. Super Admin can assign Admin to the center

**API Endpoint**:
```typescript
POST /api/medical-centers/admin/create
{
  "name": "Bangkok Blood Center",
  "organizationId": "org-123",
  "address": "1871 Henri Dunant Road",
  "city": "Bangkok",
  "locationLat": 13.7563,
  "locationLng": 100.5018,
  "phone": "+66-2-256-4000",
  "email": "bangkok@redcross.or.th"
}
```

## Multi-Tenancy Considerations

### Data Isolation

✅ **Implemented**:
- Organizations are completely isolated
- Centers belong to exactly one organization
- Staff/Admin tied to one center
- Super Admin tied to one organization

❌ **Not Implemented** (see IMPLEMENTATION_ISSUES.md):
- Row-level security enforcement
- Organization-scoped queries for Super Admin
- Validation that Admin can only modify their center

### Performance

**Indexing Strategy**:
```sql
-- Fast lookup by organization
CREATE INDEX idx_centers_org ON medical_centers(organizationId);

-- Fast lookup by center
CREATE INDEX idx_staff_center ON medical_center_staff(medicalCenterId);

-- Fast lookup by organization (for Super Admin)
CREATE INDEX idx_staff_org ON medical_center_staff(organizationId);
```

### Scalability

Current architecture supports:
- ✅ Multiple organizations on same platform
- ✅ Unlimited centers per organization
- ✅ Unlimited staff per center
- ✅ Soft deletes for data retention
- ⚠️ No sharding strategy (single database)

## Future Enhancements

1. **Multi-Region Support**
   - Add `region` field to organizations
   - Support different time zones
   - Localized content per region

2. **Organization Branding**
   - Custom themes per organization
   - White-label support
   - Custom email templates

3. **Inter-Organization Collaboration**
   - Share blood inventory across organizations
   - Emergency blood requests across orgs
   - Unified donor registry

4. **Advanced Analytics**
   - Organization-level dashboards
   - Cross-center comparisons
   - Predictive analytics for blood demand

## Related Documentation

- [ROLES_AND_PERMISSIONS.md](./ROLES_AND_PERMISSIONS.md) - Detailed role descriptions
- [IMPLEMENTATION_ISSUES.md](./IMPLEMENTATION_ISSUES.md) - Known issues and fixes
- [DATABASE_SCHEMA_V2.md](./DATABASE_SCHEMA_V2.md) - Complete schema documentation
- [stakeholders-and-scope.md](./stakeholders-and-scope.md) - Original requirements

