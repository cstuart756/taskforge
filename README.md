# TaskForge

A web-based task management application (SaaS) for small teams.

> **Status:** In development — Stage 1 (Discovery & Setup)

## Overview

TaskForge is a simple, affordable task management tool for small teams
(2–15 people) who have outgrown spreadsheets but cannot justify the cost
and complexity of enterprise tools like Jira or Asana.

Team members can create, assign, and track tasks in a fast, focused
interface that works on desktop, tablet, and mobile.

## Features

- ✅ User registration and authentication (Auth.js)
- ✅ Teams with member roles and permissions
- ✅ Team invitations with secure email-based acceptance
- ✅ Task creation, editing, and soft deletion
- ✅ Task status tracking (Open / In progress / Done)
- ✅ Task assignment to team members
- ✅ Task comments and discussion
- ✅ Dashboard with live task metrics
- ✅ All-tasks view with status filters
- ⏳ Billing and subscriptions (planned)
- ⏳ Admin user management (planned)
- ⏳ Email notifications (planned)

## Tech stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript |
| Frontend | React |
| Framework | Next.js |
| Styling | Tailwind CSS |
| Backend | Next.js server features |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Clerk or Auth.js |
| Payments | Stripe |
| Testing | Vitest and Playwright |
| Hosting | Heroku (EU region) |
| Version control | Git and GitHub |

## Getting started

> Setup instructions will be completed as the project develops.

### Prerequisites

- Node.js (LTS)
- npm
- Git
- A GitHub account
- VS Code

### Installation

```bash
git clone https://github.com/cstuart756/taskforge.git
cd taskforge
npm install