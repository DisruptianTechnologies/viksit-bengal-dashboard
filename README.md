# Viksit Bengal Dashboard

Turborepo monorepo for the **Viksit Bengal Dashboard & \$1 Trillion Economy Platform**.

> For comprehensive system architecture, API schemas, threat models, WCAG 2.2 AA audit results, and data pipelines, see [**`DOCUMENTATION.md`**](./DOCUMENTATION.md).

---

## Workspace Structure

- **`apps/web`**: Next.js 14 App Router frontend with `next-intl` (English & Bengali), accessible Radix UI primitives, Leaflet GIS district mapping, and Admin CMS.
- **`apps/api`**: NestJS 10 backend REST API with JWT Auth, RBAC guards (`ADMIN`, `RESEARCHER`, `PUBLIC`), DTO input sanitization, and Prisma database integration.
- **`packages/database`**: Prisma ORM schema targeting PostgreSQL, with migration scripts and seed dataset for 23 West Bengal districts, targets, categories, and users.
- **`packages/shared`**: Shared TypeScript types, enums, constants, and Bengali numeral utilities (`০–৯`).
- **`tests/`**: Master 4-tier E2E opaque-box test runner covering feature validation, boundary checks, pairwise workflows, and threat defense.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Set up `.env` files in `apps/api` and `apps/web`:
```bash
# apps/api/.env
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/viksit_bengal?schema=public"
JWT_SECRET="viksit-bengal-super-secret-jwt-key-2026"

# apps/web/.env.local
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXTAUTH_SECRET="viksit-bengal-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Migration & Seed
```bash
npx prisma db push --schema=./packages/database/prisma/schema.prisma
npx prisma db seed --schema=./packages/database/prisma/schema.prisma
```

### 4. Run Development Servers
```bash
npm run dev
```
- Web: `http://localhost:3000`
- API: `http://localhost:3001`

---

## Testing & Verification

```bash
# Standalone WCAG 2.2 AA Accessibility Test Suite (136 tests)
node apps/web/__tests__/wcag-accessibility.test.mjs

# Master 4-Tier E2E Test Suite
npm run test:e2e
```

---

## Production Deployment (cPanel & Hostinger hPanel)

Detailed production deployment guides for:
- **cPanel (CloudLinux Setup Node.js App, Phusion Passenger, Apache `.htaccess` Reverse Proxy)**
- **Hostinger hPanel (Shared/Cloud Node.js Manager & Hostinger VPS with PM2, Nginx, PostgreSQL, and Let's Encrypt SSL)**

Refer to [**`DOCUMENTATION.md` Section 11**](./DOCUMENTATION.md#11-production-deployment-guide-cpanel--hostinger-hpanel).


