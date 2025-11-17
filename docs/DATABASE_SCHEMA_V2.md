# Database Schema v2 - Improvements and Best Practices

## Overview

This document describes the improved database schema for HemaWeb, applying industry best practices and addressing issues in the initial design.

## Key Improvements

### 1. Unified User Table

**Problem**: Original schema had 3 separate user tables (`Account`, `MedicalCenterAccount`, `SystemAdminAccount`), leading to:
- Code duplication
- Complex authentication logic
- Difficult user management

**Solution**: Single `User` table with polymorphic profiles:

```
User (unified)
├── Profile (for donors)
├── MedicalCenterStaff (for staff/admin/super_admin)
└── SystemAdmin (for system administrators)
```

**Benefits**:
- ✅ Single authentication flow
- ✅ Easier user management
- ✅ Consistent audit logging
- ✅ Simplified session management

### 2. Reference Tables (Справочники)

**Problem**: Hardcoded enums in schema made it impossible to:
- Add new blood types without migration
- Customize role permissions
- Translate values
- Add metadata to statuses

**Solution**: Reference tables for all lookup data:

| Reference Table | Purpose | Pre-populated |
|----------------|---------|---------------|
| `BloodTypeRef` | Blood types (A+, O-, etc.) | ✅ 8 types |
| `UserRoleRef` | User roles with permissions | ✅ 5 roles |
| `BloodDriveStatusRef` | Blood drive statuses | ✅ 4 statuses |
| `BloodDriveTypeRef` | Blood drive types | ✅ 2 types |
| `AvailabilityStatusRef` | Donor availability | ✅ 3 statuses |
| `NotificationTypeRef` | Notification types | ✅ 5 types |

**Benefits**:
- ✅ No migrations needed to add new values
- ✅ Can store translations
- ✅ Can add descriptions and metadata
- ✅ Can deactivate values without deleting
- ✅ Permissions stored in JSON for flexibility

### 3. Proper PostGIS Geography

**Problem**: Original schema used `Unsupported("geography(Point, 4326)")` which:
- Doesn't work well with Prisma
- Hard to query
- No type safety

**Solution**: Hybrid approach:

```prisma
model Profile {
  locationLat       Float?
  locationLng       Float?
  locationGeography Unsupported("geography(Point, 4326)")? // For PostGIS queries
}
```

**Benefits**:
- ✅ `lat/lng` fields for easy access in application
- ✅ `geography` field for PostGIS spatial queries
- ✅ Can use both approaches as needed

**PostGIS Queries**:
```sql
-- Find donors within 10km radius
SELECT * FROM profiles
WHERE ST_DWithin(
  location_geography,
  ST_SetSRID(ST_MakePoint($lng, $lat), 4326)::geography,
  10000 -- meters
);
```

### 4. Audit Fields

**Problem**: No tracking of who created/updated records

**Solution**: Added audit fields where appropriate:

```prisma
model BloodDrive {
  createdById String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime? // Soft delete
  
  createdBy User @relation("CreatedByUser", fields: [createdById], references: [id])
}
```

**Benefits**:
- ✅ Full audit trail
- ✅ Soft delete support
- ✅ Know who performed actions
- ✅ PDPA compliance

### 5. Normalized Structure

**Problem**: Data duplication and inconsistencies

**Solution**: Proper normalization:

**Blood Drive Blood Types** (Many-to-Many):
```prisma
model BloodDriveBloodType {
  bloodDriveId String
  bloodTypeId  String
  quantity     Int? // How many units needed
  
  @@unique([bloodDriveId, bloodTypeId])
}
```

**Benefits**:
- ✅ No duplicate data
- ✅ Easy to query
- ✅ Can track quantity needed per blood type

### 6. Additional Improvements

#### Medical Records Enhancement
```prisma
model DonationRecord {
  hemoglobinLevel Float? // g/dL
  bloodPressure   String? // e.g., "120/80"
  certificateUrl  String? // PDF certificate
}

model VerificationRecord {
  weight          Float? // kg
  hemoglobinLevel Float? // g/dL
  bloodPressure   String? // e.g., "120/80"
  expiresAt       DateTime? // Verification expiry
}
```

#### Medical Center Details
```prisma
model MedicalCenter {
  code           String? @unique // Short code
  operatingHours Json? // { "monday": "08:00-17:00", ... }
  website        String?
}
```

#### Information Records
```prisma
model InformationRecord {
  slug        String @unique // URL-friendly slug
  tags        String[] // Array of tags
  viewCount   Int @default(0)
}
```

## Schema Comparison

| Aspect | v1 (Original) | v2 (Improved) |
|--------|---------------|---------------|
| **User Tables** | 3 separate tables | 1 unified table |
| **Blood Types** | Enum | Reference table |
| **Roles** | Enum | Reference table with permissions |
| **Geography** | Unsupported only | Lat/Lng + Geography |
| **Audit** | Basic timestamps | Full audit trail |
| **Soft Delete** | No | Yes (deletedAt) |
| **Indexes** | Minimal | Comprehensive |
| **Normalization** | Some duplication | Fully normalized |

## Migration Path

### Step 1: Create Reference Tables
```bash
pnpm db:migrate:create --name create_reference_tables
```

### Step 2: Seed Reference Data
```bash
pnpm db:seed:references
```

### Step 3: Migrate User Tables
```bash
pnpm db:migrate:create --name unify_user_tables
```

### Step 4: Update Application Code
- Update authentication logic
- Update queries to use reference tables
- Update PostGIS queries

## Reference Data

All reference tables are pre-populated with initial data:

### Blood Types (8)
- O+, O-, A+, A-, B+, B-, AB+, AB-

### User Roles (5)
- donor
- staff
- admin
- super_admin
- system_admin

### Blood Drive Statuses (4)
- upcoming
- active
- completed
- cancelled

### Blood Drive Types (2)
- scheduled
- emergency

### Availability Statuses (3)
- available
- emergencies_only
- unavailable

### Notification Types (5)
- blood_drive_alert
- donation_confirmation
- verification_complete
- cooldown_reminder
- general

## Indexes

All foreign keys and frequently queried fields have indexes:

```prisma
@@index([userId])
@@index([bloodTypeId])
@@index([medicalCenterId])
@@index([createdAt])
@@index([isActive])
```

## Next Steps

1. ✅ Review schema v2
2. [ ] Update ER diagram in documentation
3. [ ] Create Prisma migrations
4. [ ] Update seed script
5. [ ] Test migrations locally
6. [ ] Deploy to staging
7. [ ] Update API code to use new schema

## Questions?

See `packages/database/prisma/schema-v2.prisma` for the complete schema.

