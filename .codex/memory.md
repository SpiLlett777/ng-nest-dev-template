# Project memory

Updated: 2026-09-27. Keep this file short; update only on explicit user request.

## Working agreements

- Communicate in Russian. Follow AGENTS.md; do not duplicate its full rules
  here.
- Experimental mode is active until explicitly canceled: no new tests or
  test/build/typecheck/lint runs without explicit user request. Default to
  diff review, browser if available, and git diff --check. Agree
  risk-sensitive checks first. AGENTS.md defines priority over ordinary
  checks, including lint:workspace.
- Never assume local work is deployed. Server configuration changes are a
  separate task.
- Do not store credentials or secrets here. Preserve unrelated working-tree
  changes.

## Project map

- Product: SportLink, B2B/B2C platform connecting athletes and advertisers.
  Managed deals with clear rights, deadlines and proof of execution. Base
  market is Russia, Russian language, RUB payments.
- Nx monorepo: Angular 19 web, NestJS 11 API, Prisma/PostgreSQL; Yarn 4.
- Apps: apps/web and apps/api.
- Feature libraries: `libs/web/<library>` and `libs/api/<library>`.
- Platform Nx names: web-<library>, api-<library>; aliases @sl/web/<library>,
  @sl/api/<library>. Decide once whether to rename @sl to @sportlink and
  stick with it.
- Shared contracts: libs/shared/shared. Naming validation command:
  yarn lint:workspace; explicit request required during experimental mode.
- Prisma schema/migrations: libs/api/database-main/src/lib/prisma.
- Web HTTP services/state: libs/web/data-access. Shared UI:
  libs/web/common-ui.
- Role layouts: libs/web/layout. Account settings: libs/web/profile.
- Domain modules required by the product brief: identity, organizations,
  verification, athletes, catalog, briefs, offers, deals, contracts, edo,
  payments, payouts, tariffs, creatives, placements (ORD), acceptance,
  disputes, moderation, support, analytics, charity, notifications, admin,
  integrations, audit, outbox, idempotency.

## Stable domain constraints

- Access principle: role + organization/client + concrete object +
  permission. Delegation never transfers signing or payout rights
  automatically.
- Roles (13): guest, athlete, advertiser, advertiser-team-member
  (marketer / approver / accountant / signer), agent/agency, legal
  representative, moderator, support & arbiter, lawyer/compliance,
  financial operator, content manager, super-admin, fund representative.
  External systems are service accounts, not user roles.
- One human account, multiple working contexts. Adding a role must not
  create a second account.
- RBAC is permission-based (`deal:sign`, `payout:approve`, `user:verify`),
  not a flat role check. Object-level checks are mandatory on every server
  request.
- Auth: access/refresh JWT cookies, rotating sessions, sid in access token,
  unique jti in refresh. Refresh token stored as an SHA-256 digest for
  comparison, never as raw bcrypt of the JWT (bcrypt 72-byte truncation).
- Enhanced verification is required for signing, payout requisites and
  financial actions.
- Public and private data are separated at schema and API level.
  Requisites, deal documents and personal contacts never appear in public
  responses.
- Idempotency keys are mandatory for payment webhooks, retryable POSTs and
  background jobs. A successful provider callback must not double-charge,
  double-pay or double-credit the tariff offset.
- Audit entries record author, time, reason and previous version. Manual
  financial corrections require a second approver and never overwrite
  history.
- Tariff, contract templates, pricing formulas and ORD rules are versioned.
  Changing them never rewrites already-signed deals.
- Deal lifecycle states are separate: contract, financing, execution,
  acceptance, reporting. Acceptance ≠ payout. A signed act ≠ a confirmed
  payment.
- Status changes come only from trusted actions or verified provider
  callbacks.
- ORD: erid issuance is not an authorization to place; missing mandatory
  data blocks the workflow.
- Analytics: distinguish measured, participant-provided and forecast data.
  Show freshness and source; never zero out missing values.

## Integrations and storage

- Object storage supports local MinIO and production MinIO/R2; no
  local-file fallback. Image and document bytes live in S3-compatible
  storage; metadata/objectKey stay in DB.
- Buckets: evidence, creatives, contracts, media-kits, avatars. Provider
  switches must preserve object keys.
- Integration adapters share one shape: payment provider, EDO provider, ORD
  provider, social/analytics provider, email provider, requisites provider.
  Each has an owner, API versions and a test environment.
- Operator scripts belong in scripts/; workspace tooling belongs in tools/.

## Commands and cautions

- yarn start:web; yarn start:api (applies migrations first).
- yarn build:web; yarn build:api.
- yarn nx lint <project>; yarn nx test <project> --runInBand.
- yarn db:main:generate; yarn db:main:deploy.
- Development infrastructure: yarn start:api-deps:docker.
- NEVER run yarn db:main:seed just to update schema: it truncates/recreates
  the development dataset.
- Use migrations, not db push, for production.
- An API may already use port 3000; use a different port for isolated
  checks.
- Deployment/storage/backups: DEPLOYMENT.md and OBJECT_STORAGE.md.
- Production host may be shared; never stop unknown services or use global
  Docker/volume cleanup.
- Do not assume old backup/deployment status is current; inspect when
  needed.

## Current status

- No SportLink domain code is implemented yet. Treat this file as the
  source of truth for agreed constraints until the first feature is merged.
- Prisma schema is expected to be rewritten from scratch under
  libs/api/database-main. All inherited migrations must be removed before
  the first SportLink migration.
- No tests, builds, typechecks or lint runs are planned during experimental
  mode.

## Open questions

- Keep @sl/* aliases or rename to @sportlink/*. <!-- TODO -->
- Does the functional-model document live inside the repo (docs/) or
  outside it. <!-- TODO -->
- Which payment provider (YooKassa / T-Bank / SBP / other), EDO operator
  and ORD operator will be used. <!-- TODO -->
- Keep or replace the naming rules in
  tools/scripts/validate-project-naming.mjs. <!-- TODO -->
