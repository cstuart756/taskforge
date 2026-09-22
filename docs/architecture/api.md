# API Design

TaskForge exposes two kinds of server interface:

1. **Server Actions** — for form submissions and mutations from the app UI.
2. **Route Handlers** — for external integrations, webhooks, and any programmatic access.

## Conventions

### Route handler paths
/api/tasks GET list
/api/tasks POST create
/api/tasks/[id] GET read
/api/tasks/[id] PATCH update
/api/tasks/[id] DELETE delete
text


### Request and response format

- Requests and responses are JSON unless documented otherwise.
- Field names use camelCase.
- Dates use ISO 8601 (e.g. `2026-09-22T14:30:00Z`).
- Errors have a consistent shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required.",
    "fields": { "title": "Title is required." }
  }
}

HTTP status codes
Code	Meaning
200	Success
201	Created
204	No content (delete success)
400	Bad request (validation)
401	Unauthenticated
403	Unauthorised
404	Not found
409	Conflict (duplicate)
429	Rate limited
500	Server error
Authentication

    Session cookies for browser requests.

    Future: bearer tokens for external API access (v2).

Authorisation

    Every request is checked server-side.

    Users only access resources belonging to their team.

    Role checks enforced in server code, never trusted from the client.

Rate limiting

    Authentication endpoints: 5 requests per minute per IP.

    Write endpoints: 60 requests per minute per user.

    Read endpoints: 300 requests per minute per user.

Webhooks

    Stripe webhooks at /api/webhooks/stripe.

    Signature verified on every request.

    Idempotent handlers — duplicate events are safe.

Endpoints (planned for v1)
Method	Path	Purpose	FR
POST	/api/auth/register	Register user	FR-010
POST	/api/auth/login	Login	FR-012
POST	/api/auth/logout	Logout	FR-013
POST	/api/auth/reset	Request password reset	FR-014
GET	/api/tasks	List tasks	FR-024
POST	/api/tasks	Create task	FR-020
GET	/api/tasks/[id]	Read task	FR-025
PATCH	/api/tasks/[id]	Update task	FR-021
DELETE	/api/tasks/[id]	Delete task	FR-022
POST	/api/tasks/[id]/comments	Add comment	FR-035
POST	/api/teams	Create team	FR-030
POST	/api/teams/invite	Invite user	FR-031
POST	/api/webhooks/stripe	Stripe webhook	FR-051

Full request/response specifications will be documented per endpoint as
they are implemented.
