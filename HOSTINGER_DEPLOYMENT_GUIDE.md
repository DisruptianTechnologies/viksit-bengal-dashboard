# Hostinger Unlimited Hosting — Complete Deployment Guide

This guide covers deploying the **Viksit Bengal Dashboard** onto **Hostinger Unlimited Shared / Cloud Hosting** with Node.js and MySQL.

---

## 1. Prerequisites in Hostinger hPanel

1. **Create MySQL Database**:
   - Go to **hPanel $\rightarrow$ Databases $\rightarrow$ MySQL Databases**.
   - Create a database: e.g. `u123456789_viksit`.
   - Create a user and password: e.g. `u123456789_viksit_user` / `YourSecurePassword2026!`.
   - Note down:
     - **Database Host**: Usually `localhost` or `127.0.0.1`.
     - **Port**: `3306`.

2. **Configure Node.js Application**:
   - Go to **hPanel $\rightarrow$ Advanced / Website $\rightarrow$ Node.js**.
   - Click **Create Application**.
   - **Node.js Version**: Select **20.x** (or 22.x).
   - **Application Mode**: Production.
   - **Application Root**: `public_html` (or your domain directory).
   - **Application Startup File**: `start.js`.

---

## 2. Environment Variables (.env)

In your Hostinger Application Root, create or update `.env`:

```env
# Database Connection (Hostinger MySQL)
DATABASE_URL="mysql://u123456789_viksit_user:YourSecurePassword2026!@127.0.0.1:3306/u123456789_viksit"

# Base URLs
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Cryptographic Token Secret
JWT_SECRET="viksit_bengal_secure_jwt_secret_production_2026"

# AI & Scraper Integrations (Add your API keys)
GEMINI_API_KEY="your-google-gemini-api-key"
FIRECRAWL_API_KEY="your-firecrawl-api-key"
OPENROUTER_API_KEY="your-openrouter-api-key"
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"
OPENROUTER_MODEL="anthropic/claude-3.5-sonnet"
```

---

## 3. Build & Launch

In Hostinger Web Terminal (or SSH):

```bash
# 1. Install dependencies
npm install

# 2. Synchronize MySQL Schema (generates tables in Hostinger MySQL)
npm run db:push --workspace=@viksit/database

# 3. Seed initial categories, 23 districts, and promises
npm run db:seed --workspace=@viksit/database

# 4. Build standalone Next.js production output
npm run build

# 5. Start / Restart in hPanel Node.js Manager (or PM2)
node start.js
# Or via PM2:
# npx pm2 start ecosystem.config.js
```

---

## 4. Production Health Verification

Once started, test your live health endpoint:
```bash
curl https://yourdomain.com/api/health
```
Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-10-21T...",
  "uptime": 45,
  "environment": "production",
  "database": {
    "connected": true,
    "provider": "mysql"
  },
  "dataSummary": {
    "promisesCount": 141,
    "districtsCount": 23,
    "evidenceCount": 18
  },
  "version": "1.0.0"
}
```
