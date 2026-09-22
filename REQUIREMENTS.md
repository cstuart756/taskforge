# TaskForge — Requirements

This document defines **what** TaskForge must do. It does not describe
**how** it will be built. Technical decisions belong in the architecture
documentation under `docs/architecture/`.

## 1. Purpose and scope

TaskForge is a web-based task management application (SaaS) for small
teams (2–15 people). It allows team members to create, assign, and track
tasks through a simple, focused interface that works on desktop, tablet,
and mobile.

This document covers version 1 (v1). Features planned for later versions
are listed in section 8 as out of scope.

## 2. Stakeholders and user roles

| Role | Authenticated | Description |
|------|--------------|-------------|
| Visitor | No | Views public marketing pages, pricing, and sign-up forms. |
| Team member | Yes | Creates and manages their own tasks. |
| Supervisor | Yes | Assigns tasks to team members and monitors progress. |
| Administrator | Yes | Manages users, roles, and team settings. |
| Business owner | Yes | Views reports and billing information. |

A single user may hold multiple roles.

## 3. Feature inventory

Each feature has a unique ID (FR = Functional Requirement) used for
traceability to Issues, tests, and code.

### 3.1 Public site

| ID | Feature |
|----|---------|
| FR-001 | Homepage with product overview |
| FR-002 | Features page |
| FR-003 | Pricing page |
| FR-004 | About page |
| FR-005 | Contact form |
| FR-006 | Privacy policy page |
| FR-007 | Terms of service page |

### 3.2 Authentication and accounts

| ID | Feature |
|----|---------|
| FR-010 | User registration with email and password |
| FR-011 | Email verification |
| FR-012 | User login |
| FR-013 | User logout |
| FR-014 | Password reset via email |
| FR-015 | Session management and secure cookies |
| FR-016 | Account settings (name, email, password) |

### 3.3 Task management

| ID | Feature |
|----|---------|
| FR-020 | Create task |
| FR-021 | Edit task |
| FR-022 | Delete task |
| FR-023 | Mark task complete / reopen task |
| FR-024 | View list of own tasks |
| FR-025 | Task detail view |
| FR-026 | Task fields: title, description, due date, priority, status, assignee |
| FR-027 | Task filtering (by status, assignee, due date) |
| FR-028 | Task search |

### 3.4 Team and collaboration

| ID | Feature |
|----|---------|
| FR-030 | Team creation |
| FR-031 | Invite users to team |
| FR-032 | Assign task to team member |
| FR-033 | View tasks assigned to a team member |
| FR-034 | Supervisor view: all team tasks |
| FR-035 | Comments on tasks |
| FR-036 | Activity log per task |

### 3.5 Administration

| ID | Feature |
|----|---------|
| FR-040 | Administrator dashboard |
| FR-041 | List, invite, deactivate users |
| FR-042 | Assign and change user roles |
| FR-043 | Team settings (name, branding) |
| FR-044 | Audit log of administrative actions |

### 3.6 Billing

| ID | Feature |
|----|---------|
| FR-050 | Subscription plans (Free, Pro) |
| FR-051 | Stripe checkout |
| FR-052 | Manage subscription (upgrade, downgrade, cancel) |
| FR-053 | Invoices and billing history |
| FR-054 | Enforce plan limits (users, tasks) |

### 3.7 Notifications and integrations

| ID | Feature |
|----|---------|
| FR-060 | In-app notifications (task assigned, due soon) |
| FR-061 | Email notifications (task assigned, weekly summary) |
| FR-062 | Webhook endpoints for external systems |

### 3.8 Reporting

| ID | Feature |
|----|---------|
| FR-070 | Team activity dashboard |
| FR-071 | Task completion metrics |
| FR-072 | Export data (CSV) |

## 4. MoSCoW prioritisation

| Priority | Meaning |
|----------|---------|
| **M** — Must have | Essential for the release. Without it, the release is not viable. |
| **S** — Should have | Important, but can be delivered after the essential scope. |
| **C** — Could have | Useful, optional for this release. |
| **W** — Won't have this time | Explicitly excluded from v1. |

| ID | Feature | Priority |
|----|---------|----------|
| FR-001 | Homepage | M |
| FR-002 | Features page | S |
| FR-003 | Pricing page | M |
| FR-004 | About page | C |
| FR-005 | Contact form | C |
| FR-006 | Privacy policy | M |
| FR-007 | Terms of service | M |
| FR-010 | User registration | M |
| FR-011 | Email verification | S |
| FR-012 | User login | M |
| FR-013 | User logout | M |
| FR-014 | Password reset | M |
| FR-015 | Session management | M |
| FR-016 | Account settings | S |
| FR-020 | Create task | M |
| FR-021 | Edit task | M |
| FR-022 | Delete task | M |
| FR-023 | Mark complete / reopen | M |
| FR-024 | View own tasks | M |
| FR-025 | Task detail view | M |
| FR-026 | Task fields | M |
| FR-027 | Task filtering | S |
| FR-028 | Task search | C |
| FR-030 | Team creation | M |
| FR-031 | Invite users | M |
| FR-032 | Assign task | M |
| FR-033 | View assigned tasks | M |
| FR-034 | Supervisor view | S |
| FR-035 | Comments on tasks | S |
| FR-036 | Activity log | C |
| FR-040 | Admin dashboard | S |
| FR-041 | User management | S |
| FR-042 | Role management | S |
| FR-043 | Team settings | C |
| FR-044 | Audit log | C |
| FR-050 | Subscription plans | M |
| FR-051 | Stripe checkout | M |
| FR-052 | Manage subscription | M |
| FR-053 | Invoices | S |
| FR-054 | Plan limits | M |
| FR-060 | In-app notifications | S |
| FR-061 | Email notifications | S |
| FR-062 | Webhooks | W |
| FR-070 | Team dashboard | S |
| FR-071 | Completion metrics | C |
| FR-072 | CSV export | C |

## 5. User stories

Written in the form: *As a [role], I want [action], so that [benefit].*

### Authentication

- **US-001** — As a visitor, I want to register with my email and password, so that I can start using TaskForge.
- **US-002** — As a registered user, I want to log in, so that I can access my tasks.
- **US-003** — As a logged-in user, I want to log out, so that my account is secure on shared devices.
- **US-004** — As a user who forgot my password, I want to reset it via email, so that I can regain access.

### Task management

- **US-010** — As a team member, I want to create a task with a title, description, and due date, so that I can track my work.
- **US-011** — As a team member, I want to edit my tasks, so that I can keep them accurate.
- **US-012** — As a team member, I want to delete tasks I no longer need, so that my list stays relevant.
- **US-013** — As a team member, I want to mark a task complete, so that I can see my progress.
- **US-014** — As a team member, I want to view all my tasks in one list, so that I know what to work on.

### Team and collaboration

- **US-020** — As a supervisor, I want to assign a task to a team member, so that work is distributed.
- **US-021** — As a supervisor, I want to see all tasks in my team, so that I can monitor progress.
- **US-022** — As a team member, I want to see tasks assigned to me, so that I know my priorities.
- **US-023** — As a team member, I want to comment on a task, so that I can discuss it with colleagues.

### Administration

- **US-030** — As an administrator, I want to invite a new user, so that they can join the team.
- **US-031** — As an administrator, I want to change a user's role, so that permissions stay correct.
- **US-032** — As an administrator, I want to deactivate a user, so that former team members lose access.

### Billing

- **US-040** — As a business owner, I want to subscribe to a paid plan, so that my team gets full functionality.
- **US-041** — As a business owner, I want to view my invoices, so that I can reconcile payments.
- **US-042** — As a business owner, I want to cancel my subscription, so that I am not charged again.

### Reporting

- **US-050** — As a business owner, I want to see team activity, so that I can understand productivity.
- **US-051** — As a supervisor, I want to see completion metrics, so that I can track progress against goals.

## 6. Acceptance criteria

Each Must-have user story has specific, testable acceptance criteria.

### US-001 — Registration

- The registration form accepts email and password.
- Email must be valid format.
- Password must be at least 8 characters, with at least one letter and one number.
- Duplicate emails are rejected with a clear message.
- On success, the user is signed in and redirected to their dashboard.
- On failure, no account is created and a clear error is shown.

### US-002 — Login

- The login form accepts email and password.
- Invalid credentials produce a generic error (never reveal whether email or password was wrong).
- On success, the user is redirected to their dashboard.
- Sessions persist across page reloads until logout or expiry.

### US-003 — Logout

- A logout control is available from the user menu on every authenticated page.
- On logout, the session is cleared and the user is redirected to the homepage.
- After logout, protected pages redirect to login.

### US-004 — Password reset

- The user can request a reset link by email.
- The link expires after 30 minutes.
- The reset form accepts a new password meeting the same rules as registration.
- After reset, all existing sessions are invalidated.

### US-010 — Create task

- The user can open a "New Task" form.
- Fields: title (required), description (optional), due date (optional), priority (default: normal), assignee (optional).
- On submit, the task is saved and appears in the user's task list.
- A success confirmation is shown.
- If save fails, an error is shown and no task is created.

### US-011 — Edit task

- The user can open an existing task in edit mode.
- All fields are editable except the task ID and creation date.
- On save, changes are persisted.
- Only the task owner or a supervisor can edit.

### US-012 — Delete task

- The user can delete a task they own.
- Deletion requires confirmation.
- On confirm, the task is removed from all views.
- Deletion is reversible by an administrator within 30 days (soft delete).

### US-013 — Mark complete / reopen

- The user can mark a task complete.
- The task's status changes to "Completed".
- Completed tasks are visually distinct in lists.
- The user can reopen a completed task.
- Completion time is recorded.

### US-014 — View own tasks

- The user sees a list of their tasks.
- The list shows title, status, due date, priority, and assignee.
- The list supports pagination or infinite scroll.
- Empty state shows guidance on creating a first task.

### US-020 — Assign task

- A supervisor can assign a task to any active team member.
- The assignee receives a notification.
- The assignee sees the task in their "Assigned to me" list.

### US-021 — Supervisor view

- A supervisor can see all tasks in their team.
- The view supports filtering by assignee and status.
- The view shows counts by status (open, in progress, completed).

### US-040 — Subscribe to paid plan

- The user can choose a plan from the pricing page.
- Checkout is handled by Stripe.
- On successful payment, the account is upgraded immediately.
- A receipt is emailed.

### US-041 — View invoices

- The user sees a list of past invoices.
- Each invoice can be downloaded as a PDF.
- Invoice data matches Stripe records.

### US-042 — Cancel subscription

- The user can cancel their subscription.
- On cancellation, the plan remains active until the end of the paid period.
- After the period, the account reverts to the Free plan.
- The user is warned about data limits if exceeding Free tier.

## 7. Non-functional requirements

These are requirements about *how well* the system must work.

### Performance

- **NFR-P01** — Homepage loads in under 2 seconds on a 4G connection.
- **NFR-P02** — Authenticated pages load in under 1.5 seconds on a 4G connection.
- **NFR-P03** — API responses return in under 500 ms for typical queries.
- **NFR-P04** — Core Web Vitals pass "Good" thresholds.

### Security

- **NFR-S01** — All traffic over HTTPS (TLS 1.2+).
- **NFR-S02** — Passwords hashed with Argon2 or bcrypt.
- **NFR-S03** — Protection against OWASP Top 10 (XSS, CSRF, injection, etc.).
- **NFR-S04** — Multi-factor authentication available (optional for users).
- **NFR-S05** — Secrets stored in environment variables, never in source control.
- **NFR-S06** — Rate limiting on authentication endpoints.
- **NFR-S07** — Session cookies are Secure, HttpOnly, and SameSite.

### Accessibility

- **NFR-A01** — Conforms to WCAG 2.1 Level AA.
- **NFR-A02** — All interactive elements keyboard-accessible.
- **NFR-A03** — Colour contrast meets WCAG AA.
- **NFR-A04** — Semantic HTML and ARIA where appropriate.
- **NFR-A05** — All images have appropriate alt text.

### Compatibility

- **NFR-C01** — Works on the latest two versions of Chrome, Firefox, Safari, and Edge.
- **NFR-C02** — Responsive from 320 px (mobile) to 2560 px (large desktop).
- **NFR-C03** — Usable on touch devices.

### Reliability

- **NFR-R01** — 99.5% uptime target.
- **NFR-R02** — Automated daily database backups, retained for 30 days.
- **NFR-R03** — Failed requests logged with sufficient context for diagnosis.

### Privacy and legal

- **NFR-L01** — GDPR-compliant handling of personal data.
- **NFR-L02** — Users can request export and deletion of their data.
- **NFR-L03** — Privacy policy and terms of service available and accurate.

## 8. Out of scope for v1

The following are explicitly not part of v1:

- Native mobile applications (iOS, Android).
- Real-time collaborative editing of tasks.
- AI-powered task suggestions or summaries.
- Third-party integrations beyond Stripe (Slack, Google Calendar, etc.).
- Multi-language interface.
- Advanced analytics and custom reporting.
- Time tracking.
- Gantt charts.
- File attachments on tasks.
- Webhooks for external systems.

These may be considered for future versions.

## 9. Assumptions and constraints

### Assumptions

- Users have a modern browser and stable internet connection.
- Users have an email address.
- Teams are small (2–15 users) in v1.
- Payment is handled entirely by Stripe.

### Constraints

- Hosting on Heroku EU region.
- Development by a solo developer in evenings and weekends.
- Budget for third-party services (Stripe, email, monitoring) is minimal during development.
- PostgreSQL is the primary database.

## 10. Glossary

| Term | Definition |
|------|-----------|
| SaaS | Software as a Service — software accessed online, typically by subscription. |
| MoSCoW | Prioritisation method: Must, Should, Could, Won't. |
| MVP | Minimum Viable Product — the smallest version that delivers value. |
| FR | Functional Requirement. |
| NFR | Non-Functional Requirement. |
| RBAC | Role-Based Access Control. |
| WCAG | Web Content Accessibility Guidelines. |
| GDPR | General Data Protection Regulation (EU). |
| OWASP | Open Worldwide Application Security Project. |
| CRUD | Create, Read, Update, Delete. |