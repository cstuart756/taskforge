# Architecture Overview

How TaskForge is structured technically.

## High-level system
em

┌────────────────────────────────────────────────────────────────┐
│ Browser (desktop, tablet, mobile) │
│ React UI · TypeScript · Tailwind CSS │
└───────────────────────────┬────────────────────────────────────┘
│ HTTPS
┌───────────────────────────▼────────────────────────────────────┐
│ Next.js application (Node.js runtime, Heroku EU) │
│ │
│ · Server Components and Client Components │
│ · API Route Handlers (/app/api/*) │
│ · Server Actions │
│ · Authentication middleware │
│ · Business logic │
└──┬─────────────────┬──────────────────┬─────────────────┬──────┘
│ │ │ │
▼ ▼ ▼ ▼
┌──────────┐ ┌─────────────┐ ┌───────────────┐ ┌─────────────┐
│PostgreSQL│ │Stripe │ │Email (Resend) │ │Monitoring │
│(Prisma) │ │Payments │ │Transactional │ │(Sentry, │
│ │ │ │ │email │ │PostHog) │
└──────────┘ └─────────────┘ └───────────────┘ └─────────────┘
text


## Technology choices

| Layer | Choice | Why |
|-------|--------|-----|
| Language | TypeScript | Static typing reduces bugs and improves tooling |
| Frontend | React | Component model, huge ecosystem, job market |
| Framework | Next.js | Full-stack in one project, excellent DX, SSR/SSG |
| Styling | Tailwind CSS | Utility-first, no context switching, small bundle |
| Backend | Next.js route handlers + server actions | Co-located with frontend, no separate service |
| Database | PostgreSQL | Robust, relational, well-suited to our data |
| ORM | Prisma | Type-safe queries, excellent migrations |
| Authentication | Clerk or Auth.js (decision pending) | Battle-tested, avoids reinventing auth |
| Payments | Stripe | Industry standard, well-documented |
| Email | Resend | Simple API, good deliverability |
| Testing | Vitest (unit), Playwright (E2E) | Fast, modern, widely used |
| Hosting | Heroku (EU region) | Simple deploys, EU data residency |
| Monitoring | Sentry, PostHog | Error tracking and product analytics |
| CI/CD | GitHub Actions | Free for public repos, integrated with GitHub |

## Project structure

taskforge/
├── .github/
│ └── workflows/ # CI/CD pipelines
├── docs/ # Architecture, design, API documentation
├── prisma/
│ ├── schema.prisma # Database schema
│ └── migrations/ # Migration history
├── public/ # Static assets (images, icons, robots.txt)
├── src/
│ ├── app/ # Next.js App Router
│ │ ├── (public)/ # Public marketing pages
│ │ ├── (auth)/ # Login, register, reset
│ │ ├── app/ # Authenticated application
│ │ └── api/ # API route handlers
│ ├── components/ # Reusable UI components
│ │ ├── ui/ # Primitives (Button, Input, Card)
│ │ └── features/ # Feature-specific components
│ ├── lib/ # Utilities, helpers, shared logic
│ │ ├── db.ts # Prisma client instance
│ │ ├── auth.ts # Auth helpers
│ │ └── utils.ts # Misc helpers
│ └── styles/ # Global CSS
├── tests/
│ ├── unit/ # Vitest unit tests
│ └── e2e/ # Playwright end-to-end tests
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
text


## Environments

| Environment | Purpose | Database |
|-------------|---------|----------|
| Local | Development on Stuart's machine | Local PostgreSQL or Supabase dev DB |
| Test | Automated tests (CI) | In-memory or ephemeral PostgreSQL |
| Staging | Pre-production verification | Heroku Postgres (staging app) |
| Production | Live users | Heroku Postgres (production app) |

## Deployment flow

Local development
↓ git push origin main
GitHub repository
↓ GitHub Actions: lint, typecheck, test, build
CI passes
↓ git push heroku main (or automatic via Action)
Heroku EU
↓ Release phase: prisma migrate deploy
Production live
text


## Security posture

- HTTPS only (TLS 1.2+)
- Passwords hashed with Argon2
- All secrets via environment variables
- Sessions in Secure, HttpOnly, SameSite cookies
- OWASP Top 10 protections at framework level and in custom code
- Input validation on every server boundary
- Rate limiting on authentication routes

## Future considerations

- Moving to a separate API service if the app grows
- Read replicas if database load increases
- CDN in front of static assets
- Background job queue (BullMQ or similar) for email, exports
- Multi-region deployment if user base becomes global
