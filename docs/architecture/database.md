# Database Schema

PostgreSQL, accessed via Prisma ORM.

## Entity relationship diagram (v1)
┌──────────┐ ┌──────────┐ ┌──────────┐
│ User │───┐ │ Team │───┐ │ Task │
│ │ │ │ │ │ │ │
│ id │ │ │ id │ │ │ id │
│ email │ │ │ name │ │ │ title │
│ name │ │ │ createdAt│ │ │ desc │
│ password │ │ └──────────┘ │ │ status │
│ role │ │ │ │ │ priority │
│ teamId │───┘ │ │ │ dueDate │
│ createdAt│ │ │ │ teamId │
│ updatedAt│ │ │ │ creatorId│
└──────────┘ │ │ │ assigneeId│
│ │ │ createdAt│
│ │ │ updatedAt│
│ │ └──────────┘
│ │ │
│ │ │
▼ │ ▼
┌──────────┐ │ ┌──────────┐
│ TeamMember│ │ │ Comment │
│ userId │ │ │ id │
│ teamId │ │ │ taskId │
│ role │ │ │ authorId │
│ joinedAt │ │ │ body │
└──────────┘ │ │ createdAt│
│ └──────────┘
│
▼
┌──────────┐
│ Invitation│
│ id │
│ email │
│ teamId │
│ role │
│ token │
│ expiresAt│
└──────────┘
text


## Tables (v1)

### User

| Column | Type | Notes |
|--------|------|-------|
| id | String (cuid) | Primary key |
| email | String | Unique, required |
| name | String | Required |
| passwordHash | String | Required (managed by auth provider if using Clerk/Auth.js) |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

### Team

| Column | Type | Notes |
|--------|------|-------|
| id | String (cuid) | Primary key |
| name | String | Required |
| plan | Enum (FREE, PRO) | Default FREE |
| stripeCustomerId | String? | Nullable |
| stripeSubscriptionId | String? | Nullable |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

### TeamMember

| Column | Type | Notes |
|--------|------|-------|
| id | String (cuid) | Primary key |
| userId | String | Foreign key to User |
| teamId | String | Foreign key to Team |
| role | Enum (MEMBER, SUPERVISOR, ADMIN, OWNER) | Default MEMBER |
| joinedAt | DateTime | Auto |

Unique constraint: (userId, teamId)

### Task

| Column | Type | Notes |
|--------|------|-------|
| id | String (cuid) | Primary key |
| title | String | Required |
| description | String? | Optional |
| status | Enum (OPEN, IN_PROGRESS, DONE) | Default OPEN |
| priority | Enum (LOW, NORMAL, HIGH) | Default NORMAL |
| dueDate | DateTime? | Optional |
| completedAt | DateTime? | Nullable |
| deletedAt | DateTime? | Soft delete |
| teamId | String | Foreign key to Team |
| creatorId | String | Foreign key to User |
| assigneeId | String? | Foreign key to User |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

### Comment

| Column | Type | Notes |
|--------|------|-------|
| id | String (cuid) | Primary key |
| taskId | String | Foreign key to Task |
| authorId | String | Foreign key to User |
| body | String | Required |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

### Invitation

| Column | Type | Notes |
|--------|------|-------|
| id | String (cuid) | Primary key |
| email | String | Required |
| teamId | String | Foreign key to Team |
| role | Enum (MEMBER, SUPERVISOR, ADMIN) | Default MEMBER |
| token | String | Unique |
| expiresAt | DateTime | Required |
| acceptedAt | DateTime? | Nullable |
| createdAt | DateTime | Auto |

## Enums

Plan: FREE | PRO
TeamRole: MEMBER | SUPERVISOR | ADMIN | OWNER
TaskStatus: OPEN | IN_PROGRESS | DONE
TaskPriority: LOW | NORMAL | HIGH
text


## Indexes

- `User.email` — unique index
- `TeamMember (userId, teamId)` — unique composite index
- `Task.teamId` — index (frequent filter)
- `Task.assigneeId` — index (frequent filter)
- `Task.status` — index (frequent filter)
- `Invitation.token` — unique index

## Migration strategy

- Schema changes made in `prisma/schema.prisma`
- Migrations generated with `npx prisma migrate dev --name description`
- Migrations applied in production with `npx prisma migrate deploy`
- Backward-compatible changes preferred (add columns nullable, backfill, then enforce)
- Destructive changes (drop column) require staging verification first

## Backups

- Heroku Postgres automated daily backups, retained 30 days
- Before major migrations, manual snapshot taken
- Restore procedure documented in docs/architecture/runbook.md (to be created)
