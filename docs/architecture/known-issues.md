# Known Issues

A record of deliberate decisions to accept known non-critical issues.

## 2026-09-29 - npm audit: 6 vulnerabilities in Vitest dev dependencies

**Status:** Accepted, monitor

**Summary:** `npm audit` reports 6 vulnerabilities (3 moderate, 1 high,
2 critical) added when installing Vitest 2.x. All originate from Vitest
and its transitive dependencies (`@vitest/mocker`, `esbuild`, `vite`,
`vite-node`).

**Affected packages:**

| Package | Severity | Pulled in by |
|---------|----------|-------------|
| @vitest/mocker | Moderate | vitest |
| esbuild | Moderate | vitest → vite |
| vite | (transitive) | vitest → vite-node |

**Why we are accepting this:**

- All 6 vulnerabilities are in Vitest's **development-time** dependencies.
- The production application never loads Vitest or its dependencies.
- The suggested fix (`npm audit fix --force`) would upgrade Vitest to v5,
  which requires `@types/node@22` — incompatible with our Node 20 setup
  and would require a full Node runtime upgrade.
- These vulnerabilities affect only developers running tests locally, and
  only in contrived scenarios (malicious test files, untrusted websites
  requesting the local dev server).

**Mitigation:**

- Do not run untrusted test code.
- Do not expose the Vitest dev server to the public internet.
- Plan a Node 22 LTS upgrade in a future sprint, then upgrade to Vitest 3 or 5.
- Do not run `npm audit fix --force`.

**Review date:** Revisit when the Node 20 → 22 upgrade is planned.

## 2026-09-24 — npm audit: 13 vulnerabilities in dev tooling

**Status:** Accepted, monitor

**Summary:** `npm audit` reports 13 vulnerabilities (5 moderate, 8 high)
in the project's dependency tree. All of them originate from `prisma`
(the development CLI), not from `@prisma/client` (the runtime library).

**Affected packages:**

| Package | Severity | Pulled in by |
|---------|----------|-------------|
| @hono/node-server | High | prisma → @prisma/dev |
| hono | High | prisma → @prisma/dev |
| lodash | High | prisma → @prisma/dev → @mrleebo/prisma-ast → chevrotain |
| valibot | Moderate | prisma → @prisma/dev |

**Why we are accepting this:**

- All four packages are development-only dependencies.
- They are not included in the production build.
- They are not reachable from application runtime code.
- The only commands that trigger them are `npx prisma ...` invocations.
- The suggested fix upgrades Prisma to v7, which is a breaking major
  version change that we are not ready to migrate to during initial
  development.

**Mitigation:**

- Monitor the Prisma GitHub releases for a 6.x patch that updates the
  internal dependencies.
- Plan a deliberate migration to Prisma 7 in a future sprint, with
  proper testing.
- Do not run `npm audit fix --force` (would break the project).

**Review date:** Revisit once the MVP is complete and deployed.