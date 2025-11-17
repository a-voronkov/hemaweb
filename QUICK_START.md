# HemaWeb Quick Start Guide

## Prerequisites

```bash
# Required software
- Node.js 20 LTS
- pnpm 8+
- Docker Desktop
- Git
- VS Code (recommended)
```

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15 + TypeScript | Donor & Admin UIs |
| **UI Library** | shadcn/ui + Tailwind CSS | Component library |
| **Backend** | NestJS + TypeScript | REST API |
| **Database** | PostgreSQL 16 + PostGIS | Data storage + geolocation |
| **ORM** | Prisma | Database access |
| **Auth** | Lucia Auth + JWT | Authentication |
| **Maps** | Leaflet + OpenStreetMap | Geolocation features |
| **Cache** | Redis | Sessions, rate limiting |
| **Monorepo** | Turborepo + pnpm | Workspace management |
| **Deployment** | Docker Compose | Local & production |

## Project Structure

```
hemaweb/
├── apps/
│   ├── web/              # Next.js frontend (port 3000)
│   └── api/              # NestJS backend (port 3001)
├── packages/
│   ├── database/         # Prisma schema & migrations
│   ├── types/            # Shared TypeScript types
│   ├── ui/               # Shared UI components
│   └── config/           # ESLint, TS configs
├── docker/               # Docker configurations
├── docker-compose.yml    # Production setup
├── docker-compose.dev.yml # Development overrides
└── DEVELOPMENT_PLAN.md   # Detailed development plan
```

## Development Phases (14 weeks)

### Phase 1: Setup (Week 1)
- Initialize monorepo with Turborepo
- Configure Docker Compose (PostgreSQL, Redis)
- Setup shared packages

### Phase 2: Backend Foundation (Week 2-3)
- Setup NestJS with Prisma
- Define database schema (ER diagram → Prisma)
- Implement basic CRUD operations

### Phase 3: Authentication (Week 4)
- Implement Lucia Auth + JWT
- Create auth endpoints (login, register, refresh)
- Setup RBAC middleware

### Phase 4: Frontend Foundation (Week 5)
- Setup Next.js 15 with App Router
- Configure shadcn/ui components
- Create layouts for donor/staff/admin

### Phase 5: Donor Features (Week 6-7)
- Unverified: home, medical centers map, profile
- Verified: blood drives, donation history, cooldown

### Phase 6: Medical Staff Features (Week 8-9)
- Donor verification flow
- Donation recording
- Blood drive management

### Phase 7: Admin Features (Week 10)
- Admin: staff management
- Super Admin: center management
- System Admin: organization management

### Phase 8: Geolocation (Week 11)
- Integrate Leaflet maps
- Implement PostGIS radius searches
- Location picker component

### Phase 9: Notifications (Week 12)
- Email service (Nodemailer)
- Notification system
- Scheduled tasks (reminders)

### Phase 10: Testing & Docs (Week 13-14)
- Unit & integration tests
- API documentation (Swagger)
- Deployment guides

## Quick Commands

```bash
# Install dependencies
pnpm install

# Start Docker services
docker-compose up -d

# Run database migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Start development servers
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Lint & format
pnpm lint
pnpm format
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://hemaweb:password@localhost:5432/hemaweb"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Email (optional for Phase 9)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## User Roles & Permissions

| Role | Description | Key Features |
|------|-------------|--------------|
| **Donor (Unverified)** | Registered user | Browse info, view centers map |
| **Donor (Verified)** | Medically verified | Find blood drives, donate, view history |
| **Staff** | Medical center staff | Verify donors, record donations |
| **Admin** | Medical center admin | Manage staff, view center records |
| **Super Admin** | Organization admin | Manage centers, admins, staff |
| **System Admin** | Platform admin | Manage organizations, content |

## Key Features by User Type

### Donors
- ✅ Registration & login
- ✅ Medical center discovery (map)
- ✅ Blood drive search (nearby, by blood type)
- ✅ Donation history & certificates
- ✅ Cooldown countdown
- ✅ Availability status

### Medical Staff
- ✅ Donor verification
- ✅ Donation recording
- ✅ Blood drive creation
- ✅ Activity logs

### Admins
- ✅ Staff account management
- ✅ Center records viewing
- ✅ Blood drive oversight

### System Admins
- ✅ Organization management
- ✅ Content management
- ✅ User suspension

## Next Steps

1. **Review** `DEVELOPMENT_PLAN.md` for detailed tasks
2. **Setup** development environment (Docker, Node.js, pnpm)
3. **Start Phase 1** - create project structure
4. **Follow** the plan week by week

---

Ready to start development? See `DEVELOPMENT_PLAN.md` for detailed implementation steps.

