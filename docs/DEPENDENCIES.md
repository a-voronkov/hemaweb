# HemaWeb Dependencies

**Last Updated:** 2025-11-17

## Philosophy

We use **latest stable versions** of all dependencies to ensure:
- Latest security patches
- Best performance
- Modern features
- Active community support
- Long-term maintainability

---

## Core Dependencies

### Backend (API)

**Framework:**
- `@nestjs/core`: ^11.1.9 (latest stable)
- `@nestjs/common`: ^11.1.9
- `@nestjs/platform-express`: ^11.1.9
- `@nestjs/config`: ^4.0.2
- `@nestjs/swagger`: ^11.2.2

**Database:**
- `@prisma/client`: ^6.19.0 (latest stable, was 5.8.1)
- `prisma`: ^6.19.0

**Authentication:**
- `lucia`: ^3.2.2 (session-based auth)
- `@lucia-auth/adapter-prisma`: ^4.0.1
- `oslo`: ^1.2.1 (crypto utilities)

**Validation:**
- `class-validator`: ^0.14.2
- `class-transformer`: ^0.5.1

**Utilities:**
- `bcrypt`: ^6.0.0 (password hashing)
- `nodemailer`: ^7.0.10 (email)
- `cookie-parser`: ^1.4.7

---

### Frontend (Web)

**Framework:**
- `next`: ^16.0.3 (latest stable)
- `react`: ^19.2.0 (latest stable)
- `react-dom`: ^19.2.0

**UI Components:**
- `@radix-ui/react-*`: ^2.1.8 (headless UI primitives)
  - react-checkbox: ^1.1.3
  - react-label: ^2.1.8
  - react-select: ^2.1.8
  - react-separator: ^1.1.8
  - react-slot: ^1.2.4
- `lucide-react`: ^0.554.0 (icons)

**Styling:**
- `tailwindcss`: ^4.0.0 (latest major version)
- `@tailwindcss/postcss`: ^4.0.0
- `tailwind-merge`: ^3.4.0
- `class-variance-authority`: ^0.7.1

**Forms:**
- `react-hook-form`: ^7.54.2
- `@hookform/resolvers`: ^5.2.2
- `zod`: ^4.1.12 (schema validation, latest stable)

**Compiler:**
- `babel-plugin-react-compiler`: 1.0.0 (React 19 compiler)

---

## Version Selection Criteria

### 1. Latest Stable Versions
- ✅ Use: Latest **stable** releases
- ✅ TypeScript: Synchronized across monorepo (^5.9.3)
- ✅ All packages use consistent versions

### 2. Security First
- Always use versions with latest security patches
- Monitor GitHub Security Advisories
- Update promptly when CVEs are published

### 3. Ecosystem Compatibility
- Ensure all dependencies work together
- Test major version upgrades thoroughly
- Check peer dependency warnings

### 4. LTS Support
- Prefer packages with Long-Term Support
- Node.js: Use LTS versions (20.x, 22.x)
- TypeScript: Latest stable (5.7.x)

---

## Update Strategy

### Regular Updates (Monthly)
```bash
# Check for updates
pnpm outdated

# Update patch versions (safe)
pnpm update

# Update minor versions (review changelog)
pnpm update --latest
```

### Major Version Updates (Quarterly)
1. Read migration guides
2. Test in development
3. Run full test suite
4. Deploy to staging
5. Monitor for issues
6. Deploy to production

### Security Updates (Immediate)
```bash
# Check for vulnerabilities
pnpm audit

# Fix automatically
pnpm audit fix

# Manual review for breaking changes
```

---

## Prisma 6.x Migration

**Why upgrade from 5.x to 6.x:**
- ✅ Better TypeScript performance
- ✅ Improved query engine
- ✅ Enhanced type safety
- ✅ Better error messages
- ✅ Performance improvements

**Breaking Changes:**
- None that affect our codebase
- Generator output path works the same
- All queries compatible

---

## React 19 Features Used

- ✅ React Compiler (automatic optimization)
- ✅ Server Components (Next.js)
- ✅ Improved hydration
- ✅ Better error handling

---

## Next.js 16

**Using 16.0.3:**
- Latest stable release
- React 19 support
- Improved performance
- Better developer experience

---

## TypeScript 5.9.3

**Synchronized across monorepo:**
- Root: ^5.9.3
- API: ^5.9.3
- Web: ^5.9.3
- Database: ^5.9.3

**Benefits:**
- Consistent type checking
- No version conflicts
- Better IDE support
- Stable and tested

---

## Monitoring & Maintenance

**Tools:**
- Dependabot (GitHub) - automated PR for updates
- `pnpm outdated` - check for new versions
- `pnpm audit` - security vulnerabilities

**Schedule:**
- Security updates: Immediate
- Patch updates: Weekly
- Minor updates: Monthly
- Major updates: Quarterly (with testing)

---

## References

- [Prisma Releases](https://github.com/prisma/prisma/releases)
- [Next.js Releases](https://github.com/vercel/next.js/releases)
- [React Releases](https://react.dev/blog)
- [NestJS Releases](https://github.com/nestjs/nest/releases)

