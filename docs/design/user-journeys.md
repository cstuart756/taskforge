# User Journeys

Each journey shows the sequence of screens a user passes through to
accomplish a goal. Error paths are shown separately.

## Journey 1 — New visitor becomes a registered user

1. Landing page (`/`)
2. Click "Get started" → Registration form (`/register`)
3. Submit valid details → Confirmation email sent
4. Click verification link (optional for MVP)
5. Onboarding page (`/onboarding`)
6. Dashboard with empty state (`/app`)

### Alternative paths

- Invalid email or weak password → inline errors on registration form.
- Email already registered → "An account with this email already exists" message with link to login.
- Verification link expired → resend option.

## Journey 2 — Logged-in user creates and completes a task

1. Dashboard (`/app`)
2. Click "New task" → Task creation form (`/app/tasks/new`)
3. Fill and submit → Task saved
4. Task list shows new task (`/app/tasks`)
5. User clicks task → Task detail (`/app/tasks/[id]`)
6. User clicks "Mark complete" → Status changes to Completed
7. Task list shows updated state

### Alternative paths

- Validation error on save → field-level error messages.
- Network failure → "Could not save. Try again." with retry action.
- No permission → 403 page or redirect.

## Journey 3 — Supervisor assigns a task

1. Dashboard (`/app`)
2. Navigate to Team view (`/app/team`)
3. Click "Assign task" → form modal or page
4. Select assignee, fill details, submit
5. Task appears in assignee's list
6. Assignee receives notification

### Alternative paths

- Assignee inactive → cannot be selected.
- Assignee not in team → not shown.

## Journey 4 — Business owner subscribes

1. Pricing page (`/pricing`)
2. Click "Upgrade to Pro" → redirect to Stripe Checkout
3. Complete payment on Stripe
4. Redirected back to `/app/billing/success`
5. Plan active, dashboard shows "Pro" badge
6. Receipt emailed by Stripe

### Alternative paths

- Payment declined → return to `/app/billing/cancelled` with message.
- Session expired → prompt to log in again.