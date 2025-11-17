# Database Schema v2 - Migration Plan

## Overview

This document outlines the plan to migrate from the initial database schema (v1) to the improved schema (v2) for HemaWeb.

**Domain**: `hemaweb.world`  
**Hosting**: Digital Ocean Droplet  
**Deployment**: Docker Compose + GitHub Actions

## Schema Improvements Summary

### 1. Unified User Table ✅
- **Before**: 3 separate tables (Account, MedicalCenterAccount, SystemAdminAccount)
- **After**: 1 User table with polymorphic profiles (Profile, MedicalCenterStaff, SystemAdmin)
- **Benefit**: Simplified authentication, easier user management

### 2. Reference Tables ✅
- **Before**: Hardcoded enums (BloodType, UserRole, etc.)
- **After**: Reference tables (BloodTypeRef, UserRoleRef, etc.)
- **Benefit**: No migrations needed to add new values, can store metadata

### 3. Proper PostGIS Geography ✅
- **Before**: Only `Unsupported("geography(Point, 4326)")`
- **After**: `lat/lng` fields + `geography` field for PostGIS queries
- **Benefit**: Easy access in app + powerful spatial queries

### 4. Audit Fields ✅
- **Before**: Basic timestamps
- **After**: createdBy, updatedBy, deletedAt (soft delete)
- **Benefit**: Full audit trail, PDPA compliance

### 5. Normalized Structure ✅
- **Before**: Some data duplication
- **After**: Fully normalized (e.g., BloodDriveBloodType many-to-many)
- **Benefit**: No duplicate data, easier to query

## Files Created

### Schema Files
- ✅ `packages/database/prisma/schema-v2.prisma` - New schema
- ✅ `packages/database/prisma/seeds/reference-data.ts` - Reference data
- ✅ `packages/database/prisma/seed-v2.ts` - Seed script for v2

### Documentation
- ✅ `docs/DATABASE_SCHEMA_V2.md` - Detailed schema documentation
- ✅ `DATABASE_MIGRATION_PLAN.md` - This file

## Migration Steps

### Phase 1: Local Testing ✅ (Current)

1. **Review schema v2**
   - [x] Review `schema-v2.prisma`
   - [x] Review reference data
   - [x] Review seed script

2. **Replace old schema**
   ```bash
   # Backup old schema
   mv packages/database/prisma/schema.prisma packages/database/prisma/schema-v1-backup.prisma
   
   # Use new schema
   mv packages/database/prisma/schema-v2.prisma packages/database/prisma/schema.prisma
   
   # Update seed script
   mv packages/database/prisma/seed.ts packages/database/prisma/seed-v1-backup.ts
   mv packages/database/prisma/seed-v2.ts packages/database/prisma/seed.ts
   ```

3. **Test locally**
   ```bash
   # Reset database
   pnpm db:reset
   
   # Create migration
   pnpm db:migrate:dev --name init_v2_schema
   
   # Seed database
   pnpm db:seed
   
   # Verify in Prisma Studio
   pnpm db:studio
   ```

### Phase 2: Update Documentation

1. **Update ER diagram**
   - [ ] Create new ER diagram for v2 schema
   - [ ] Update `docs/data_model.md`
   - [ ] Add migration notes

2. **Update API documentation**
   - [ ] Update endpoint examples
   - [ ] Update request/response schemas
   - [ ] Update authentication flow

### Phase 3: Digital Ocean Setup

1. **Provision Droplet**
   - [ ] Create Digital Ocean droplet (2GB RAM, 1 vCPU minimum)
   - [ ] Setup SSH keys
   - [ ] Configure firewall (ports 22, 80, 443, 5432)

2. **Install Dependencies**
   ```bash
   # On droplet
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y docker.io docker-compose git
   sudo systemctl enable docker
   sudo systemctl start docker
   ```

3. **Setup Domain**
   - [ ] Point `hemaweb.world` to droplet IP
   - [ ] Setup SSL with Let's Encrypt
   - [ ] Configure nginx reverse proxy

4. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/a-voronkov/hemaweb.git
   cd hemaweb
   
   # Setup environment
   cp .env.example .env
   # Edit .env with production values
   
   # Start services
   docker-compose up -d
   
   # Run migrations
   docker-compose exec api pnpm db:migrate
   
   # Seed database
   docker-compose exec api pnpm db:seed
   ```

### Phase 4: GitHub Actions CI/CD

1. **Create workflow file**
   - [ ] `.github/workflows/deploy.yml`
   - [ ] Setup secrets in GitHub
   - [ ] Configure auto-deployment on push to main

2. **Secrets needed**
   - `DO_SSH_KEY` - SSH private key for droplet
   - `DO_HOST` - Droplet IP address
   - `DATABASE_URL` - Production database URL
   - `JWT_SECRET` - Production JWT secret

### Phase 5: Testing & Validation

1. **Functional Testing**
   - [ ] Test all user roles
   - [ ] Test authentication flow
   - [ ] Test blood drive creation
   - [ ] Test donation recording
   - [ ] Test PostGIS queries

2. **Performance Testing**
   - [ ] Load test API endpoints
   - [ ] Test database query performance
   - [ ] Optimize slow queries

3. **Security Testing**
   - [ ] Test authentication
   - [ ] Test authorization (RBAC)
   - [ ] Test SQL injection prevention
   - [ ] Test XSS prevention

## Test Accounts (Production)

After seeding production database:

| Role | Email | Password |
|------|-------|----------|
| System Admin | sysadmin@hemaweb.world | SysAdmin123! |
| Super Admin | superadmin@hemaweb.world | SuperAdmin123! |
| Admin | admin@hemaweb.world | Admin123! |
| Staff | staff@hemaweb.world | Staff123! |
| Donor (verified) | donor1@example.com | Donor123! |
| Donor (unverified) | donor2@example.com | Donor123! |

**⚠️ Change these passwords immediately after first login in production!**

## Rollback Plan

If migration fails:

```bash
# Restore old schema
mv packages/database/prisma/schema-v1-backup.prisma packages/database/prisma/schema.prisma

# Restore old seed
mv packages/database/prisma/seed-v1-backup.ts packages/database/prisma/seed.ts

# Reset database
pnpm db:reset

# Seed with old data
pnpm db:seed
```

## Next Steps

1. ✅ Review this migration plan
2. [ ] Replace schema files locally
3. [ ] Test migrations locally
4. [ ] Update documentation
5. [ ] Setup Digital Ocean droplet
6. [ ] Configure GitHub Actions
7. [ ] Deploy to production
8. [ ] Test in production
9. [ ] Monitor and optimize

## Questions?

- Schema details: See `docs/DATABASE_SCHEMA_V2.md`
- Schema file: See `packages/database/prisma/schema-v2.prisma`
- Seed data: See `packages/database/prisma/seed-v2.ts`

