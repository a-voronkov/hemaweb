# HemaWeb

> Blood Donation Platform connecting hospitals with verified donors

**Live API:** https://hemaweb.world/api
**API Docs:** https://hemaweb.world/api/docs
**Status:** All Phases Complete - Ready for Deployment

HemaWeb is a web-based platform that connects hospitals and medical centers with verified blood donors. It is designed to help reduce chronic blood shortages (initially focusing on Thailand) by making it easier to:

- Find eligible donors near active blood drives or urgent requests
- Keep donors informed, engaged and reminded about when they can donate
- Give hospitals a structured view of donors, verifications and donation history

## Current Status

**All Development Phases Completed:**

- Phase 1: Infrastructure & Database
- Phase 2: Core Backend Foundation
- Phase 3: User Management & Authentication
- Phase 4: Blood Drive Management
- Phase 5: Donation History & Eligibility
- Phase 6: Notifications System
- Phase 7: Admin Dashboard & Analytics
- Phase 8: Maps & Calendar Integration

**Features:**

- 26 pages (donor, staff, admin portals)
- 60+ API endpoints
- Interactive map with blood drive locations
- Calendar view for donations
- Email notification system
- Role-based access control
- Responsive design (desktop & mobile)

## Quick Start

### Prerequisites

- Node.js 20 LTS or higher
- pnpm 8+ (`npm install -g pnpm`)
- Docker Desktop
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/a-voronkov/hemaweb.git
cd hemaweb

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
cp packages/database/.env.example packages/database/.env

# Start Docker services (PostgreSQL + Redis)
docker-compose up -d

# Wait for services to be healthy (check with docker-compose ps)

# Run database migrations
pnpm db:migrate:dev

# Seed the database with test data
pnpm db:seed

# Start development servers
pnpm dev
```

### Access the Application

- **Frontend**: http://localhost:3000 (Next.js)
- **Backend API**: http://localhost:3001 (NestJS)
- **Database**: PostgreSQL on `localhost:5432`
- **Redis**: `localhost:6379`
- **pgAdmin**: <http://localhost:5050> (optional, use `docker-compose --profile tools up`)

### Test Accounts

After seeding, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@hemaweb.local | SuperAdmin123! |
| Admin | admin@hemaweb.local | Admin123! |
| Staff | staff@hemaweb.local | Staff123! |
| System Admin | sysadmin@hemaweb.local | SysAdmin123! |
| Donor (verified) | donor1@example.com | Donor123! |
| Donor (unverified) | donor2@example.com | Donor123! |

## Technology Stack

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
├── docs/                 # Project documentation
├── docker-compose.yml    # Production setup
└── DEVELOPMENT_PLAN.md   # Detailed development plan
```

## Documentation

All project documentation derived from the original specification document (**"ITX3007 SE HemaWeb Project Final"**) lives under `./docs`.

### Quick navigation

- **Documentation index** – [`./docs/README.md`](./docs/README.md)
- **Quick start guide** – [`./docs/QUICK_START.md`](./docs/QUICK_START.md)
- **Final summary** – [`./FINAL_SUMMARY.md`](./FINAL_SUMMARY.md)

### Production & Deployment

- **Production Setup** – [`./PRODUCTION_SETUP.md`](./PRODUCTION_SETUP.md) - Self-hosted runner setup
- **Deployment Guide** – [`./DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- **Server Scripts** – [`./scripts/README.md`](./scripts/README.md) - Server setup scripts
- **Quick Commands** – [`./scripts/QUICK_COMMANDS.md`](./scripts/QUICK_COMMANDS.md) - Command cheatsheet

### Core documentation

- **Project overview** – [`./docs/project-overview.md`](./docs/project-overview.md)
- **Stakeholders and scope** – [`./docs/stakeholders-and-scope.md`](./docs/stakeholders-and-scope.md)
- **System design** – [`./docs/system-design.md`](./docs/system-design.md)
- **Data flow diagrams** – [`./docs/system_design_dfds.md`](./docs/system_design_dfds.md)
- **Data model** – [`./docs/data_model.md`](./docs/data_model.md)

### User interface documentation

- **Donor mobile web UI** – [`./docs/ui_donor.md`](./docs/ui_donor.md)
- **Medical staff/admin desktop UI** – [`./docs/ui_medical_staff.md`](./docs/ui_medical_staff.md)
- **System administrator UI** – [`./docs/ui_system_admin.md`](./docs/ui_system_admin.md)

## Development Commands

```bash
# Development
pnpm dev                  # Start all apps in development mode
pnpm build                # Build all apps
pnpm lint                 # Lint all apps
pnpm format               # Format code with Prettier
pnpm test                 # Run tests

# Database
pnpm db:migrate:dev       # Create and apply migration
pnpm db:migrate           # Apply migrations (production)
pnpm db:seed              # Seed database with test data
pnpm db:studio            # Open Prisma Studio
pnpm db:reset             # Reset database (⚠️ deletes all data)

# Docker
pnpm docker:up            # Start Docker services
pnpm docker:down          # Stop Docker services
pnpm docker:logs          # View Docker logs
pnpm docker:clean         # Stop and remove volumes
```

## Development Phases

All 8 development phases completed. See [`FINAL_SUMMARY.md`](./FINAL_SUMMARY.md) for complete feature overview.

**Status**: Ready for deployment and testing

## License

This project is part of an academic assignment for ITX3007 Software Engineering course.

## Contributing

This is an academic project. For questions or suggestions, please open an issue.
