# HemaWeb Documentation

This folder contains comprehensive documentation for the HemaWeb blood donation management platform.

Use this as the entry point to understand the problem, requirements, design, implementation, and project planning.

## 📚 Documentation Structure

### Core Documentation (Original Requirements)

- `project-overview.md` - High-level context, problem statement, objectives, and value proposition
- `stakeholders-and-scope.md` - Stakeholder definitions, functional scope, and key limitations
- `system-design.md` - Main logical flows for donors, medical staff, admins, and system admins
- `data_model.md` - ER diagram reference and high-level description of core tables
- `system_design_dfds.md` - Text summary of the original DFD diagrams
- `ui_donor.md` - Donor-facing (mobile web) UI mockups and flows
- `ui_medical_staff.md` - Medical staff/admin/super admin desktop UI
- `ui_system_admin.md` - Platform-level system administrator UI
- `project_management.md` - Methodology, tech stack, and timeline
- `cost_and_benefit.md` - COCOMO effort estimate, team assumptions, and qualitative benefits
- `references.md` - Bibliographic references and source material

### Implementation Documentation

- **`ROLES_AND_PERMISSIONS.md`** ⭐ - Detailed guide to role hierarchy, permissions, and access control
- **`MEDICAL_ORGANIZATIONS.md`** ⭐ - Architecture of multi-tenant organization and medical center structure
- **`IMPLEMENTATION_ISSUES.md`** ⚠️ - Known issues, bugs, and recommended fixes (READ BEFORE PRODUCTION)
- `DATABASE_SCHEMA_V2.md` - Improved database schema with best practices
- `QUICK_START.md` - Quick start guide for developers
- `DEPENDENCIES.md` - Project dependencies and package management
- `EMAIL_SETUP.md` - Email configuration guide
- `ROADMAP.md` - Development roadmap and future features

### Visual Assets

- `./images/` - 82+ UI mockups, DFD diagrams, ER diagrams, and timeline charts
  - `./images/ui/` - User interface mockups
  - `./images/dfds/` - Data flow diagrams
  - `./images/data-model/` - Database ER diagrams
  - `./images/branding/` - Logo and branding assets

## 🚀 Quick Navigation

### For New Developers
1. Start with `QUICK_START.md` to set up your environment
2. Read `project-overview.md` to understand the problem
3. Review `ROLES_AND_PERMISSIONS.md` to understand access control
4. Check `IMPLEMENTATION_ISSUES.md` for known issues

### For Product Managers
1. Read `project-overview.md` for business context
2. Review `stakeholders-and-scope.md` for feature scope
3. Check `ROADMAP.md` for planned features
4. See `cost_and_benefit.md` for effort estimates

### For System Architects
1. Study `DATABASE_SCHEMA_V2.md` for data model
2. Review `MEDICAL_ORGANIZATIONS.md` for multi-tenancy architecture
3. Read `system-design.md` for system flows
4. Check `IMPLEMENTATION_ISSUES.md` for architectural gaps

### For DevOps
1. Start with `QUICK_START.md` for deployment
2. Review `DEPENDENCIES.md` for package requirements
3. Check `EMAIL_SETUP.md` for email configuration

## ⚠️ Important Notes

- **IMPLEMENTATION_ISSUES.md** contains critical issues that must be addressed before production deployment
- **ROLES_AND_PERMISSIONS.md** is the authoritative source for access control logic
- **MEDICAL_ORGANIZATIONS.md** explains the multi-tenant architecture

## 📊 Documentation Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| Core Requirements | ✅ Complete | Original |
| Implementation Docs | ✅ Complete | 2025-11-18 |
| API Documentation | 🟡 Partial | Swagger available |
| Deployment Guide | 🟡 Partial | See QUICK_START.md |
| Testing Guide | ❌ Missing | TBD |

## 🔗 External Resources

- **API Documentation**: Available at `/api/docs` when running the server
- **GitHub Repository**: https://github.com/a-voronkov/hemaweb
- **Live Demo**: https://hemaweb.world
