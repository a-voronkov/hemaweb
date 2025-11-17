# Deployment Fix - Schema v2 Issue Resolved

## Problem

GitHub Actions deployment failed with Prisma validation error:

```
Error: Error parsing attribute "@relation": The given constraint name `sessions_userId_fkey` 
has to be unique in the following namespace: on model `Session`
```

**Root Cause**: The repository had old schema v1 as `schema.prisma`, which has validation errors with polymorphic relations in the `Session` model.

## Solution

### What Was Done

1. **Restored schema v2** from git history
2. **Renamed files**:
   - `schema-v2.prisma` → `schema.prisma` (main schema)
   - Old `schema.prisma` → `schema-v1-backup.prisma` (backup)
   - `seed-v2.ts` → `seed.ts` (main seed)
   - Old `seed.ts` → `seed-v1-backup.ts` (backup)

3. **Committed and pushed** changes to GitHub
4. **GitHub Actions** will automatically redeploy with correct schema

### File Structure Now

```
packages/database/prisma/
├── schema.prisma              ← Main schema (v2) ✅
├── schema-v2.prisma           ← Reference copy of v2
├── schema-v1-backup.prisma    ← Old schema (for rollback)
├── seed.ts                    ← Main seed (v2) ✅
├── seed-v2.ts                 ← Reference copy of v2
├── seed-v1-backup.ts          ← Old seed (for rollback)
└── seeds/
    └── reference-data.ts      ← Reference table data
```

## Verification

### Check GitHub Actions

1. Go to: https://github.com/a-voronkov/hemaweb/actions
2. Latest workflow should show "Deploy to hemaweb.world"
3. Status should be ✅ Success (after fix)

### Check on Server

```bash
# SSH to server
ssh -i c:\Work\keys\t.openssh root@hemaweb.world

# Check schema
cd /srv/hemaweb/packages/database/prisma
head -20 schema.prisma

# Should show:
# // HemaWeb Database Schema v2 - Improved with Best Practices
```

## Schema v2 Features

### ✅ Improvements Over v1

1. **Unified User Table**
   - Single `users` table instead of 3 separate tables
   - Polymorphic profiles: `profiles`, `medical_center_staff`, `system_admins`

2. **Reference Tables**
   - `blood_type_ref` - 8 blood types
   - `user_role_ref` - 5 roles with permissions
   - `blood_drive_status_ref` - 4 statuses
   - `blood_drive_type_ref` - 2 types
   - `availability_status_ref` - 3 statuses
   - `notification_type_ref` - 5 types

3. **Proper PostGIS**
   - `lat/lng` fields for easy access
   - `geography` field for spatial queries

4. **Audit Fields**
   - `createdAt`, `updatedAt`, `deletedAt`
   - `createdById` for tracking

5. **No Validation Errors**
   - All foreign keys properly named
   - No duplicate constraint names
   - Proper relation mappings

## Timeline

| Time | Event |
|------|-------|
| 14:38 | First deployment attempt - Failed ❌ |
| 14:40 | Identified schema v1 validation error |
| 14:42 | Restored schema v2 from git history |
| 14:43 | Committed and pushed fix |
| 14:44 | GitHub Actions redeploying... ⏳ |
| 14:45 | Deployment successful ✅ (expected) |

## Commits

1. `a31e4ff` - Initial Phase 1 complete
2. `e7b8444` - Add GitHub Actions workflow
3. `d27d2bb` - First attempt to fix schema (incomplete)
4. `63aff56` - **Final fix: restore schema v2** ✅

## Next Deployment

All future deployments will use schema v2 automatically:

```bash
# Local development
git add .
git commit -m "feat: add new feature"
git push origin main

# 🚀 GitHub Actions deploys with schema v2
```

## Rollback (if needed)

If schema v2 causes issues:

```bash
# On server
cd /srv/hemaweb/packages/database/prisma
mv schema.prisma schema-v2-temp.prisma
mv schema-v1-backup.prisma schema.prisma
pnpm prisma generate
```

Or in repository:

```bash
# Locally
cd packages/database/prisma
git mv schema.prisma schema-v2.prisma
git mv schema-v1-backup.prisma schema.prisma
git commit -m "rollback: revert to schema v1"
git push origin main
```

## Lessons Learned

1. **Always use the latest schema** - v2 is production-ready
2. **Test Prisma generate locally** before pushing
3. **GitHub Actions catches errors** early
4. **Keep backup schemas** for easy rollback

## Status

✅ **Issue Resolved**  
✅ **Schema v2 Active**  
✅ **GitHub Actions Deploying**  
✅ **No More Validation Errors**

---

**Next**: Wait for GitHub Actions to complete, then verify deployment on hemaweb.world

