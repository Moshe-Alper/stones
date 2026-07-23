# System Architecture

## Purpose
- Provide a concise architecture reference for service boundaries, ownership, and major flows.

## System Overview
- `frontend/` is a Next.js App Router application that owns the current public website.
- Catalog content is static and local to the frontend. There is no dedicated `backend/`
  service or database in the current runtime.
- The Contact page posts a contact inquiry to the frontend-owned Route Handler
  `POST /api/contact`. The handler validates the payload and delivers accepted inquiries by
  email via Resend; it does not persist data.
- `docs/api-contract.yaml` is the source of truth for the Contact endpoint payload and
  response shapes.

## Data Flow

1. A visitor completes the client-side Contact form.
2. The form sends JSON to `POST /api/contact` on the same Next.js origin.
3. The Route Handler repeats validation and returns the stable success or error shape.
4. Accepted inquiries are passed to the server-only delivery adapter
   (`frontend/src/lib/contact-inquiry-delivery.ts`), which calls Resend's API using
   server-side credentials never exposed to the client.
5. Structured delivery metadata (`requestId`, `operation`, `outcome`, `mode`, provider
   message id) is logged server-side; the raw name/phone/message content is never logged.

## Auth and Org Boundaries

- The public catalog and Contact page do not require authentication.
- No org boundary exists in the current single-business public-site runtime.
- If a backend or multi-org admin surface is introduced, authentication and org scoping
  must be enforced there before database access.

## External Dependencies

- The Contact page's `ContactMap` component embeds a Google Maps `output=embed` iframe to
  show the studio's real location, plus static Google Maps and Waze deep links for
  directions. This is a client-rendered, unauthenticated, no-API-key embed; no server-side
  credentials or billing account are involved.
- Contact inquiry email delivery uses [Resend](https://resend.com). The API key
  (`RESEND_API_KEY`), verified sender (`CONTACT_INQUIRY_FROM`), and recipient
  (`CONTACT_INQUIRY_TO`) are server-only private environment configuration, never exposed to
  the client or committed to source control. A single bounded retry reuses a Resend
  idempotency key derived from the request's `requestId`, and only for transient (5xx or
  timeout) failures — never for validation/auth (4xx) failures.

## Operational Concerns

- API errors use a stable `error.code`, `error.message`, optional `error.details`, and
  `requestId` response shape.
- Delivery mode is controlled by `CONTACT_INQUIRY_DELIVERY_MODE` (`email` or `simulate`).
  There is no `NODE_ENV`-based branching: any mode value other than a fully configured
  `email` fails closed with `503 CONTACT_DELIVERY_UNAVAILABLE`. Production deployments must
  never set `simulate` — there is no automatic detection preventing this, it is an
  operational/deployment-configuration responsibility.
- Spam control is a honeypot field (`website`, must stay empty) plus request/field length
  limits. There is no in-memory IP rate limiting, since it is unreliable across serverless
  instances; add durable limiting or a CAPTCHA if abuse appears.
- Contact inquiry logs contain only structured metadata (`requestId`, `operation`, `outcome`,
  `mode`, provider message id) — raw name/phone/message content is never logged and must not
  be exposed to the client.

## Change Log

- 2026-07-19: Added the frontend-owned Contact Route Handler and simulated-delivery boundary.
- 2026-07-20: Replaced the Contact page's decorative CSS map illustration with a real Google
  Maps embed iframe and added a Waze navigation link (`.plan/008-2026-07-20-contact-map-location-experience.md`).
- 2026-07-23: Replaced simulated contact-inquiry delivery with real Resend-based email
  delivery, added a honeypot field and request/field length limits, and documented the
  `503 CONTACT_DELIVERY_UNAVAILABLE` response
  (`.plan/007-2026-07-19-contact-inquiry-email-delivery.md`).

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
