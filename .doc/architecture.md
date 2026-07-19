# System Architecture

## Purpose
- Provide a concise architecture reference for service boundaries, ownership, and major flows.

## System Overview
- `frontend/` is a Next.js App Router application that owns the current public website.
- Catalog content is static and local to the frontend. There is no dedicated `backend/`
  service or database in the current runtime.
- The Contact page posts a contact inquiry to the frontend-owned Route Handler
  `POST /api/contact`. The handler validates the payload and uses a local simulated-delivery
  log; it does not persist data or call an email provider.
- `docs/api-contract.yaml` is the source of truth for the Contact endpoint payload and
  response shapes.

## Data Flow

1. A visitor completes the client-side Contact form.
2. The form sends JSON to `POST /api/contact` on the same Next.js origin.
3. The Route Handler repeats validation and returns the stable success or error shape.
4. During development, accepted inquiries are logged server-side with a `requestId`.
5. A future email provider replaces the marked simulated-delivery seam without exposing
   provider credentials to the browser.

## Auth and Org Boundaries

- The public catalog and Contact page do not require authentication.
- No org boundary exists in the current single-business public-site runtime.
- If a backend or multi-org admin surface is introduced, authentication and org scoping
  must be enforced there before database access.

## Operational Concerns

- API errors use a stable `error.code`, `error.message`, optional `error.details`, and
  `requestId` response shape.
- The simulated delivery path is development-only. Real delivery requires an approved
  provider, private server-side credentials, bounded provider retries, and spam controls.
- Contact inquiry logs can contain personal information and must not be exposed to the client.

## Change Log

- 2026-07-19: Added the frontend-owned Contact Route Handler and simulated-delivery boundary.

## Recommended Sections
- `Context`
	- What problem the system solves and key constraints.
- `Primary Components`
	- Main services/modules and their responsibilities.
- `Data Flow`
	- Request and event flow between the Next.js frontend, Node.js backend, and database.
- `Auth and Org Boundaries`
	- Where authentication and organization scoping are enforced.
- `External Dependencies`
	- Third-party services and integration points.
- `Operational Concerns`
	- Logging, monitoring, retries, and failure handling.
- `Change Log`
	- Date-stamped notes for major architecture updates.

## Update Triggers
- Update this file when API routes, auth boundaries, org boundaries, or major component ownership changes.
