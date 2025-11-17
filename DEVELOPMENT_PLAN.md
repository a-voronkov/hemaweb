# HemaWeb Development Plan

## Technology Stack

```yaml
Frontend:
  - Next.js 15 (App Router)
  - TypeScript 5.3+
  - Tailwind CSS 3.4+
  - shadcn/ui
  - Leaflet + React-Leaflet

Backend:
  - NestJS 10+
  - TypeScript 5.3+
  - Prisma 5+
  - Lucia Auth
  - JWT

Database:
  - PostgreSQL 16+
  - PostGIS 3.4+
  - Redis 7+ (sessions, cache)

Infrastructure:
  - Docker Compose
  - Node.js 20 LTS
  - pnpm (package manager)

Development:
  - Turborepo (monorepo)
  - ESLint + Prettier
  - Husky (git hooks)
  - Zod (validation)
```

## Project Structure

```
hemaweb/
├── apps/
│   ├── web/                    # Next.js frontend
│   └── api/                    # NestJS backend
├── packages/
│   ├── database/               # Prisma schema & migrations
│   ├── types/                  # Shared TypeScript types
│   ├── ui/                     # Shared UI components
│   └── config/                 # Shared configs (ESLint, TS, etc.)
├── docker/
│   ├── postgres/
│   ├── redis/
│   └── nginx/
├── docker-compose.yml
├── docker-compose.dev.yml
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

## Development Phases

### Phase 1: Project Setup & Infrastructure (Week 1)

**Goal**: Create project skeleton with working Docker environment

#### 1.1 Initialize Monorepo
- [ ] Create root `package.json` with Turborepo
- [ ] Setup `pnpm-workspace.yaml`
- [ ] Configure `turbo.json` for build pipeline
- [ ] Create folder structure (`apps/`, `packages/`)

#### 1.2 Setup Docker Compose
- [ ] Create `docker-compose.yml` with services:
  - PostgreSQL 16 + PostGIS
  - Redis 7
  - pgAdmin (optional, for DB management)
- [ ] Create `docker-compose.dev.yml` for development overrides
- [ ] Add health checks for all services
- [ ] Create initialization scripts for PostgreSQL

#### 1.3 Shared Packages
- [ ] Create `packages/config` with shared ESLint, Prettier, TypeScript configs
- [ ] Create `packages/types` for shared TypeScript interfaces
- [ ] Setup path aliases (`@hemaweb/types`, `@hemaweb/database`)

#### 1.4 Development Environment
- [ ] Create `.env.example` files
- [ ] Setup VS Code workspace settings
- [ ] Configure Husky for pre-commit hooks
- [ ] Add scripts: `dev`, `build`, `test`, `lint`

**Deliverable**: Running `docker-compose up` starts all services, `pnpm dev` starts development

---

### Phase 2: Core Backend Foundation (Week 2-3)

**Goal**: NestJS API with Prisma ORM and database schema

#### 2.1 Initialize NestJS
- [ ] Create `apps/api` with NestJS CLI
- [ ] Configure TypeScript, ESLint for NestJS
- [ ] Setup module structure:
  - `auth/`
  - `users/`
  - `medical-centers/`
  - `blood-drives/`
  - `donations/`
- [ ] Configure environment variables with `@nestjs/config`

#### 2.2 Setup Prisma
- [ ] Create `packages/database` with Prisma
- [ ] Define Prisma schema based on ER diagram:
  - `Account` (donors)
  - `Profile`
  - `MedicalOrganization`
  - `MedicalCenter`
  - `MedicalCenterAccount` (staff/admin/super admin)
  - `BloodDrive`
  - `DonationRecord`
  - `VerificationRecord`
  - `ActivityLog`
  - `SystemAdminAccount`
- [ ] Add PostGIS types for geography fields
- [ ] Create initial migration
- [ ] Setup Prisma Client in NestJS

#### 2.3 Database Seeding
- [ ] Create seed script with sample data:
  - 1 Medical Organization
  - 2-3 Medical Centers
  - 5-10 Donor accounts
  - 2-3 Staff accounts
  - Sample blood drives
- [ ] Add seed command to `package.json`

#### 2.4 Basic CRUD Operations
- [ ] Implement base repository pattern
- [ ] Create DTOs with Zod validation
- [ ] Implement basic endpoints:
  - `GET /health` (health check)
  - `GET /users` (list users)
  - `GET /medical-centers` (list centers)

**Deliverable**: API running on `http://localhost:3001`, database seeded, basic CRUD works

---

### Phase 3: Authentication & Authorization (Week 4)

**Goal**: Secure authentication with Lucia Auth, JWT, and RBAC

#### 3.1 Setup Lucia Auth
- [ ] Install Lucia Auth and PostgreSQL adapter
- [ ] Configure Lucia with Prisma
- [ ] Create `Session` and `Key` tables in Prisma schema
- [ ] Implement session management

#### 3.2 JWT Implementation
- [ ] Create JWT service for Access Tokens (15 min expiry)
- [ ] Create Refresh Token service (7 days expiry, httpOnly cookie)
- [ ] Implement token rotation on refresh
- [ ] Add JWT verification middleware

#### 3.3 Authentication Endpoints
- [ ] `POST /auth/register` (donor registration)
- [ ] `POST /auth/login` (email + password)
- [ ] `POST /auth/logout` (invalidate session)
- [ ] `POST /auth/refresh` (refresh access token)
- [ ] `GET /auth/me` (get current user)

#### 3.4 Role-Based Access Control (RBAC)
- [ ] Create `@Roles()` decorator
- [ ] Implement `RolesGuard` for route protection
- [ ] Define permission matrix:
  - `donor` (unverified/verified)
  - `staff`
  - `admin`
  - `super_admin`
  - `system_admin`
- [ ] Add role checks to existing endpoints

#### 3.5 Security Middleware
- [ ] Add rate limiting (10 requests/min for auth endpoints)
- [ ] Implement CSRF protection
- [ ] Add helmet for security headers
- [ ] Setup CORS for frontend

**Deliverable**: Full auth flow working, protected routes, role-based access

---

### Phase 4: Frontend Foundation (Week 5)

**Goal**: Next.js app with routing, layouts, and UI components

#### 4.1 Initialize Next.js
- [ ] Create `apps/web` with Next.js 15 (App Router)
- [ ] Configure TypeScript, Tailwind CSS
- [ ] Setup path aliases (`@/components`, `@/lib`)
- [ ] Configure environment variables

#### 4.2 Setup shadcn/ui
- [ ] Initialize shadcn/ui
- [ ] Install core components:
  - Button, Input, Form, Card
  - Dialog, Dropdown, Toast
  - Table, Tabs, Avatar
- [ ] Create theme configuration (colors, fonts)
- [ ] Setup dark mode toggle (optional)

#### 4.3 Layout Structure
- [ ] Create root layout (`app/layout.tsx`)
- [ ] Create layouts for different user types:
  - `app/(donor)/layout.tsx` (mobile-friendly)
  - `app/(staff)/layout.tsx` (desktop)
  - `app/(admin)/layout.tsx` (desktop)
  - `app/(system-admin)/layout.tsx` (desktop)
- [ ] Implement navigation components:
  - Mobile bottom nav (donor)
  - Sidebar nav (staff/admin)

#### 4.4 Authentication UI
- [ ] Create login page (`/login`)
- [ ] Create registration page (`/register`)
- [ ] Implement auth context with React Context
- [ ] Create protected route wrapper
- [ ] Add loading states and error handling

#### 4.5 API Client
- [ ] Create API client with fetch/axios
- [ ] Implement request/response interceptors
- [ ] Add automatic token refresh logic
- [ ] Create React hooks for API calls:
  - `useAuth()`
  - `useUser()`
  - `useMutation()`

**Deliverable**: Next.js app running on `http://localhost:3000`, login/register working

---

### Phase 5: Donor Features (Week 6-7)

**Goal**: Complete donor-facing functionality

#### 5.1 Unverified Donor Features
- [ ] **Home page** with informational content
  - Display articles about blood donation
  - Show benefits and process
- [ ] **Medical centers map**
  - Integrate Leaflet map
  - Show nearby verification centers
  - Click for center details
- [ ] **Profile management**
  - Update personal info
  - Change password
  - Set location (map picker)

#### 5.2 Verified Donor Features
- [ ] **Blood drives discovery**
  - List nearby blood drives (PostGIS query)
  - Filter by blood type, distance, date
  - Map view with markers
- [ ] **Donation cooldown**
  - Display countdown to next eligible date
  - Calculate based on last donation
- [ ] **Donation history**
  - List past donations (date, location, volume)
  - Download donation certificate (PDF generation)
- [ ] **Availability status**
  - Toggle: Available / Emergencies Only / Unavailable
  - Affects visibility in staff searches

#### 5.3 Backend Endpoints
- [ ] `GET /blood-drives/nearby` (PostGIS radius search)
- [ ] `GET /donations/my-history`
- [ ] `POST /donations/certificate/:id` (generate PDF)
- [ ] `PATCH /profile/availability`
- [ ] `GET /medical-centers/nearby`

**Deliverable**: Donor can register, browse drives, view history, manage profile

---

### Phase 6: Medical Staff Features (Week 8-9)

**Goal**: Staff portal for donor verification and donation recording

#### 6.1 Staff Dashboard
- [ ] Create staff home page with:
  - Recent activities
  - Today's blood drives
  - Quick actions (verify donor, record donation)
- [ ] Activity log viewer (filtered by center)

#### 6.2 Donor Verification
- [ ] **Verify donor flow**:
  - Search donor by email/phone
  - Perform medical check
  - Record blood type, eligibility
  - Upload verification certificate (local file storage for now)
  - Mark donor as verified
- [ ] Backend: `POST /verifications`
- [ ] Frontend: Multi-step form with file upload

#### 6.3 Donation Recording
- [ ] **Accept donation flow**:
  - Search verified donor
  - Check eligibility (cooldown period)
  - Record donation (date, volume, blood type)
  - Set next eligible date (56 days later)
  - Log activity
- [ ] Backend: `POST /donations`
- [ ] Frontend: Form with donor search and validation

#### 6.4 Blood Drive Management
- [ ] **Create blood drive**:
  - Set type (scheduled/emergency)
  - Set location (map picker or default center)
  - Set date/time, blood types needed
- [ ] **Complete blood drive**:
  - Mark as finished
  - Summary of donations collected
- [ ] Backend: `POST /blood-drives`, `PATCH /blood-drives/:id/complete`

#### 6.5 Records Viewing
- [ ] View verification records (paginated table)
- [ ] View donation records (paginated table)
- [ ] Filter by date, donor, blood type
- [ ] Export to CSV (optional)

**Deliverable**: Staff can verify donors, record donations, manage blood drives

---

### Phase 7: Admin & System Admin Features (Week 10)

**Goal**: Admin panels for organization and user management

#### 7.1 Admin Features (Medical Center Admin)
- [ ] **Staff account management**:
  - Create staff accounts (tied to center)
  - Edit staff accounts
  - Deactivate staff accounts
- [ ] View all center's donation/verification records
- [ ] View center's blood drives
- [ ] Backend: `POST /staff`, `PATCH /staff/:id`, `DELETE /staff/:id`

#### 7.2 Super Admin Features (Medical Organization)
- [ ] **Admin account management**:
  - Create admin accounts (tied to centers)
  - Edit/deactivate admin accounts
- [ ] **Medical center management**:
  - Create medical centers
  - Edit center details (name, location, logo)
  - Deactivate centers
- [ ] View all organization's records
- [ ] Backend: `POST /admins`, `POST /medical-centers`

#### 7.3 System Admin Features (Platform-level)
- [ ] **Medical organization management**:
  - Create organizations
  - Edit organization details
  - Deactivate organizations
- [ ] **Super admin management**:
  - Create super admin accounts
  - Assign to organizations
- [ ] **Informational content management**:
  - Create/edit articles
  - Publish/unpublish content
- [ ] **User suspension**:
  - Suspend/unsuspend donor accounts
  - View suspension logs
- [ ] Backend: `POST /organizations`, `POST /super-admins`, `POST /articles`

**Deliverable**: Full admin hierarchy working, all management features functional

---

### Phase 8: Geolocation & Maps (Week 11)

**Goal**: Integrate Leaflet maps and PostGIS queries

#### 8.1 Leaflet Integration
- [ ] Install `react-leaflet` and `leaflet`
- [ ] Create reusable Map component
- [ ] Add map controls (zoom, locate me)
- [ ] Style map markers for different types:
  - Medical centers (blue)
  - Blood drives (red)
  - User location (green)

#### 8.2 Location Picker Component
- [ ] Create map-based location picker
- [ ] Click to set coordinates
- [ ] Reverse geocoding (optional, using Nominatim)
- [ ] Display selected address

#### 8.3 PostGIS Queries
- [ ] Implement radius search for blood drives:
  ```sql
  SELECT * FROM blood_drives
  WHERE ST_DWithin(
    location::geography,
    ST_SetSRID(ST_MakePoint($longitude, $latitude), 4326)::geography,
    $radiusMeters
  )
  ```
- [ ] Implement nearest medical centers query
- [ ] Add distance calculation in results
- [ ] Optimize with spatial indexes

#### 8.4 Geolocation Features
- [ ] Get user's current location (browser geolocation API)
- [ ] Store user's preferred location in profile
- [ ] Use location for nearby searches
- [ ] Handle location permission denied

**Deliverable**: Maps working, nearby searches functional, location-based features complete

---

### Phase 9: Notifications & Real-time Features (Week 12)

**Goal**: Email notifications and real-time updates

#### 9.1 Email Service
- [ ] Setup email service (Nodemailer with SMTP)
- [ ] Create email templates:
  - Welcome email (registration)
  - Verification confirmation
  - Donation confirmation
  - Donation certificate
  - Blood drive alert (matching blood type)
  - Cooldown reminder (eligible to donate again)
- [ ] Implement email queue (Bull + Redis)

#### 9.2 Notification System
- [ ] Create notifications table in database
- [ ] Implement notification creation service
- [ ] Add notification endpoints:
  - `GET /notifications` (user's notifications)
  - `PATCH /notifications/:id/read`
  - `DELETE /notifications/:id`
- [ ] Frontend: Notification bell with dropdown

#### 9.3 Real-time Updates (Optional)
- [ ] Setup WebSocket with Socket.io
- [ ] Implement real-time notifications
- [ ] Real-time blood drive updates
- [ ] Online status for staff

#### 9.4 Scheduled Tasks
- [ ] Setup cron jobs (node-cron or Bull)
- [ ] Daily task: Send cooldown reminders
- [ ] Weekly task: Send engagement emails
- [ ] Cleanup old sessions

**Deliverable**: Email notifications working, notification system functional

---

### Phase 10: Testing & Documentation (Week 13-14)

**Goal**: Comprehensive testing and documentation

#### 10.1 Backend Testing
- [ ] Unit tests for services (Jest)
- [ ] Integration tests for API endpoints (Supertest)
- [ ] Test coverage > 70%
- [ ] E2E tests for critical flows (Playwright)

#### 10.2 Frontend Testing
- [ ] Component tests (React Testing Library)
- [ ] Integration tests for pages
- [ ] E2E tests for user flows (Playwright)

#### 10.3 API Documentation
- [ ] Setup Swagger/OpenAPI in NestJS
- [ ] Document all endpoints
- [ ] Add request/response examples
- [ ] Generate API docs at `/api/docs`

#### 10.4 Deployment Documentation
- [ ] Create `DEPLOYMENT.md` with:
  - Docker Compose setup
  - Environment variables guide
  - Database migration steps
  - Backup/restore procedures
- [ ] Create `CONTRIBUTING.md` for developers
- [ ] Add inline code comments

#### 10.5 User Documentation
- [ ] Create user guides for:
  - Donors (how to register, donate)
  - Staff (how to verify, record donations)
  - Admins (how to manage accounts)
- [ ] Create video tutorials (optional)

**Deliverable**: Tested, documented, production-ready application

---

## Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 1. Project Setup | 1 week | Docker environment, monorepo structure |
| 2. Backend Foundation | 2 weeks | NestJS API, Prisma schema, basic CRUD |
| 3. Authentication | 1 week | Lucia Auth, JWT, RBAC |
| 4. Frontend Foundation | 1 week | Next.js app, shadcn/ui, layouts |
| 5. Donor Features | 2 weeks | Complete donor functionality |
| 6. Medical Staff Features | 2 weeks | Staff portal, verification, donations |
| 7. Admin Features | 1 week | Admin panels, management features |
| 8. Geolocation & Maps | 1 week | Leaflet integration, PostGIS queries |
| 9. Notifications | 1 week | Email service, notification system |
| 10. Testing & Docs | 2 weeks | Tests, API docs, deployment guides |

**Total: 14 weeks (~3.5 months)**

---

## Development Workflow

### Daily Workflow
```bash
# Start all services
docker-compose up -d

# Start development servers
pnpm dev

# Run migrations
pnpm db:migrate

# Run tests
pnpm test
```

### Git Workflow
- `main` - production-ready code
- `develop` - integration branch
- `feature/*` - feature branches
- `hotfix/*` - urgent fixes

### Code Review Checklist
- [ ] TypeScript types are correct
- [ ] Zod validation on all inputs
- [ ] Error handling implemented
- [ ] Tests written and passing
- [ ] No console.logs in production code
- [ ] Documentation updated

---

## Next Steps

1. **Review this plan** and adjust timeline/priorities
2. **Setup development environment** (Docker, Node.js, pnpm)
3. **Start Phase 1** - create project structure
4. **Daily standups** to track progress

Ready to start? Let me know if you want me to:
- Generate the initial project structure
- Create Docker Compose configuration
- Write detailed implementation guides for specific phases

---


