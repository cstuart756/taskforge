<div align="center">

# ⚡ TaskForge

**Simple, fast, and secure task management for small teams.**

[🌐 Live app](https://taskforge-stuart-65758b18053f.herokuapp.com/)

[![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)](https://heroku.com/)

</div>

---

## 📖 Overview

TaskForge is a full-stack SaaS web application that helps small teams create, assign, and track tasks without the complexity (or cost) of enterprise tools. 

Built with **Next.js (App Router)**, **TypeScript**, **Prisma**, and **Tailwind CSS**, TaskForge features an enterprise-grade authentication and security system, including Two-Factor Authentication (2FA), email verification, and distributed rate limiting.

## ✨ Features

### Core Product
- **Team Workspaces:** Create and manage multiple teams with unique URL slugs.
- **Task Management:** Create, assign, prioritize, and track tasks through custom statuses (Open, In Progress, Done).
- **Dashboard & Metrics:** At-a-glance view of open, in-progress, and overdue tasks.
- **Role-Based Access Control:** Owner, Admin, Supervisor, and Member roles.

### Enterprise-Grade Security
- **Two-Factor Authentication (2FA):** TOTP support (Google Authenticator, Authy) with 10 single-use, SHA-256 hashed backup codes.
- **Secure Two-Step Login:** Prevents session issuance until the 2FA challenge is passed, using Redis-backed single-use pending tokens.
- **Email Verification:** Required for all new accounts to prevent spam and ensure account recovery.
- **Secure Password Reset:** Single-use, expiring, cryptographically hashed tokens.
- **Rate Limiting:** Distributed sliding-window rate limiting (Upstash Redis) on all auth endpoints to prevent brute-force and email-bombing.
- **Session Management:** JWT-based sessions with instant refresh upon profile changes.
- **Re-authentication:** Sensitive actions (changing passwords, disabling 2FA) require the current password to protect against session theft.

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router, Turbopack) |
| **Language** | TypeScript |
| **Database** | PostgreSQL (hosted on Supabase) |
| **ORM** | Prisma |
| **Authentication** | Auth.js (NextAuth v5) |
| **Styling** | Tailwind CSS |
| **Transactional Email** | Resend |
| **Rate Limiting** | Upstash Redis |
| **Testing** | Playwright (E2E) |
| **Hosting** | Heroku (EU Region) |

## 🏗 Architecture & Patterns

This project implements several production-grade patterns:

- **Dual NextAuth Providers:** To enforce 2FA, the app uses two credential providers. The primary provider refuses to issue a session if 2FA is enabled. A secondary `credentials-2fa` provider consumes a short-lived Redis token and verifies the TOTP/backup code before issuing the session.
- **Pending 2FA Tokens:** When a user passes the password step, a 32-byte random token is stored in Redis (`pending2fa:<token>`) with a 5-minute TTL. This token is consumed on *any* verification attempt (valid or invalid), making brute-forcing the 2FA code impossible.
- **Hashed Tokens:** Password reset tokens and email verification tokens are never stored in plaintext. Only their SHA-256 hashes exist in the database.
- **Fail-Open Rate Limiting:** If Upstash Redis experiences an outage, the rate limiter logs the error and allows the request to proceed, ensuring a third-party outage never locks users out of the app.
- **E2E Test Bypass:** The Playwright test suite runs with `E2E_TEST_MODE=true`. This skips real email sending and automatically verifies test accounts in the database, allowing CI to run rapidly without external dependencies.

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v20+)
- A PostgreSQL database (Supabase is recommended)
- A Resend account (for email sending)
- An Upstash Redis database (for rate limiting)

### 1. Clone the repository
```bash
git clone https://github.com/cstuart756/taskforge.git
cd taskforge
. Install dependencies
bash

npm install

3. Set up environment variables

Copy the example environment file:
bash

cp .env.example .env

Fill in your .env file:
env

# Database (Supabase)
DATABASE_URL="postgresql://postgres.[ID]:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ID]:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"

# Auth.js
AUTH_SECRET="generate-a-secure-random-string"
AUTH_TRUST_HOST=true
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Resend (Email)
# Note: On the free tier without a verified domain, you can only send to your own signup email.
RESEND_API_KEY="re_your_api_key"
EMAIL_FROM="onboarding@resend.dev"

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL="https://your-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"

4. Initialize the database

Generate the Prisma client and run the migrations:
bash

npx prisma generate
npx prisma migrate deploy

5. Run the development server
bash

npm run dev

Open http://localhost:3000 in your browser.
🧪 Testing

TaskForge uses Playwright for end-to-end testing, which runs automatically on every pull request via GitHub Actions.
bash

# Run E2E tests (headless)
npx playwright test

# Run E2E tests with UI
npx playwright test --ui

☁️ Deployment

TaskForge is configured for continuous deployment on Heroku (EU Region) via GitHub Actions.

    CI/CD: Every push to main triggers linting, type-checking, and tests.

    Migrations: The Procfile includes a release command that automatically runs npx prisma migrate deploy during deployment, ensuring the production database is always in sync.

    Build: Uses Next.js Turbopack for optimized production builds.

To deploy manually:
bash

git push heroku main

🗺 Roadmap / Known Limitations

    □

    Custom Domains: Currently hosted on a Heroku subdomain.
    □

    Verified Email Domain: The Resend free tier currently restricts sending to the account owner's email address. A verified custom domain is required for public launch.
    □

    Change Email Flow: Deferred until a verified Resend domain is configured.
    □

    Stripe Billing: The Plan enum and stripeCustomerId schema fields are ready, but the UI/API integration is pending.

📄 License

This project is licensed under the MIT License.