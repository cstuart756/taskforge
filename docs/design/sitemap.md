# TaskForge Sitemap

## Public pages (unauthenticated)
/
├── /features
├── /pricing
├── /about
├── /contact
├── /privacy
├── /terms
├── /login
└── /register
text


## Authenticated application (under /app)

/app
├── /app → Dashboard (personal tasks)
├── /app/tasks → Task list
│ ├── /app/tasks/new → Create task
│ └── /app/tasks/[id] → Task detail / edit
├── /app/team → Team view (supervisors and above)
│ ├── /app/team/members → Team member list
│ └── /app/team/invite → Invite user
├── /app/admin → Admin dashboard (administrators only)
│ ├── /app/admin/users → User management
│ └── /app/admin/settings → Team settings
├── /app/billing → Subscription and invoices (business owner)
│ ├── /app/billing/success → Post-checkout confirmation
│ └── /app/billing/cancelled → Cancelled checkout
└── /app/settings → Personal account settings
text


## System pages

/404 → Not found
/500 → Server error
/api/* → API routes (not user-facing)
text


## Navigation structure

**Public header:** Logo · Features · Pricing · About · Login · Get started

**App sidebar (authenticated):** Dashboard · Tasks · Team · Billing · Settings · (Admin if applicable) · User menu

**Footer:** Privacy · Terms · Contact · © TaskForge
