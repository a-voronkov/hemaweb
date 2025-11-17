# ✅ HemaWeb Deployment Complete - hemaweb.world

## Deployment Summary

**Date**: 2024-11-17  
**Server**: hemaweb.world (Digital Ocean Droplet)  
**Status**: ✅ Successfully Deployed

---

## 🎯 What Was Deployed

### Infrastructure
- ✅ **PostgreSQL 16 + PostGIS 3.4** - Running and healthy
- ✅ **Redis 7** - Running and healthy
- ✅ **Node.js 20.19.5** - Installed
- ✅ **pnpm 9.15.4** - Installed
- ✅ **Docker Compose v2.40.3** - Already installed

### Database
- ✅ **Schema v2** - Improved schema with reference tables
- ✅ **24 tables** created (including PostGIS spatial_ref_sys)
- ✅ **6 users** seeded (system admin, super admin, admin, staff, 2 donors)
- ✅ **8 blood types** loaded
- ✅ **5 user roles** loaded with permissions
- ✅ **2 medical centers** created (Bangkok, Chiang Mai)
- ✅ **1 medical organization** created (Thai Red Cross Society)

### Application Files
- ✅ All project files uploaded to `/srv/hemaweb`
- ✅ Environment variables configured
- ✅ Dependencies installed

---

## 🔐 Production Credentials

### Database
```
Host: localhost:5432
Database: hemaweb
User: hemaweb
Password: HW_db_P@ssw0rd_2024_Secure!
```

### Redis
```
Host: localhost:6379
Password: HW_redis_K3y_2024_Strong!
```

### JWT
```
Secret: HW_jwt_S3cr3t_2024_VerySecure_RandomString_a8f9d2e1c4b7
Access Token Expiry: 15 minutes
Refresh Token Expiry: 7 days
```

---

## 👥 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **System Admin** | sysadmin@hemaweb.world | SysAdmin123! |
| **Super Admin** | superadmin@hemaweb.world | SuperAdmin123! |
| **Admin** | admin@hemaweb.world | Admin123! |
| **Staff** | staff@hemaweb.world | Staff123! |
| **Donor (verified)** | donor1@example.com | Donor123! |
| **Donor (unverified)** | donor2@example.com | Donor123! |

⚠️ **IMPORTANT**: Change these passwords after first login!

---

## 📁 Server Directory Structure

```
/srv/hemaweb/
├── packages/
│   ├── database/          # Prisma schema & migrations
│   ├── types/             # Shared TypeScript types
│   └── config/            # Shared configs
├── apps/                  # (Empty - Next.js & NestJS to be added)
├── docker/                # Docker init scripts
├── data/                  # Persistent data
│   ├── postgres/          # PostgreSQL data
│   └── redis/             # Redis data
├── .env                   # Production environment variables
├── docker-compose.yml     # Base Docker config
├── docker-compose.prod.yml # Production overrides
└── deploy.sh              # Deployment script
```

---

## 🚀 Next Steps

### 1. Setup Nginx Reverse Proxy
```bash
# Install Nginx
apt install -y nginx

# Configure reverse proxy for API
# (Will be done in next phase)
```

### 2. Setup SSL with Let's Encrypt
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d hemaweb.world -d www.hemaweb.world
```

### 3. Deploy NestJS Backend (Phase 2)
- Initialize NestJS in `apps/api`
- Configure Prisma integration
- Setup authentication with Lucia Auth
- Create basic CRUD endpoints

### 4. Deploy Next.js Frontend (Phase 4)
- Initialize Next.js in `apps/web`
- Configure shadcn/ui
- Setup layouts and routing
- Connect to backend API

### 5. Setup GitHub Actions CI/CD
- Create `.github/workflows/deploy.yml`
- Configure auto-deployment on push to main
- Add secrets to GitHub repository

---

## 🔧 Useful Commands

### SSH to Server
```bash
ssh -i c:\Work\keys\t.openssh root@hemaweb.world
```

### Check Docker Services
```bash
cd /srv/hemaweb
docker compose ps
docker compose logs -f
```

### Database Access
```bash
# Via Docker
docker compose exec postgres psql -U hemaweb -d hemaweb

# List tables
docker compose exec postgres psql -U hemaweb -d hemaweb -c '\dt'

# Query users
docker compose exec postgres psql -U hemaweb -d hemaweb -c 'SELECT email, role_id FROM users;'
```

### Restart Services
```bash
cd /srv/hemaweb
docker compose restart
```

### Update Code
```bash
cd /srv/hemaweb
git pull origin main  # (when repo is public or SSH key is added)
pnpm install
pnpm db:migrate
docker compose restart
```

---

## 📊 Database Schema v2 Highlights

### Unified User Table
- Single `users` table for all user types
- Polymorphic profiles: `profiles`, `medical_center_staff`, `system_admins`

### Reference Tables (Справочники)
- `blood_type_ref` - 8 blood types
- `user_role_ref` - 5 roles with JSON permissions
- `blood_drive_status_ref` - 4 statuses
- `blood_drive_type_ref` - 2 types
- `availability_status_ref` - 3 statuses
- `notification_type_ref` - 5 types

### PostGIS Geography
- Proper lat/lng fields + geography field for spatial queries
- Ready for radius searches (find donors within 10km, etc.)

### Audit Trail
- `createdAt`, `updatedAt`, `deletedAt` (soft delete)
- `createdById` for tracking who created records

---

## ✅ Deployment Checklist

- [x] Server provisioned and accessible
- [x] Docker and Docker Compose installed
- [x] Node.js and pnpm installed
- [x] Project files uploaded
- [x] Environment variables configured
- [x] PostgreSQL + PostGIS running
- [x] Redis running
- [x] Database schema migrated
- [x] Database seeded with test data
- [ ] Nginx reverse proxy configured
- [ ] SSL certificates installed
- [ ] NestJS backend deployed
- [ ] Next.js frontend deployed
- [ ] GitHub Actions CI/CD configured

---

## 🎉 Success!

The database and infrastructure are ready. You can now proceed with:
1. Phase 2: Core Backend Foundation (NestJS)
2. Phase 4: Frontend Foundation (Next.js)

**Current Status**: Infrastructure ✅ | Backend ⏳ | Frontend ⏳ | CI/CD ⏳

