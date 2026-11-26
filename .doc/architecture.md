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

- `agreements/` is a separate, owner-only Next.js app (opening-agreement signing service, see
  `.plan/019-2026-11-22-opening-agreement-service.md`). It is NOT part of the public website,
  runs on its own port/deployment, and owns its own database. Local dev uses embedded Postgres
  (PGlite) under `agreements/.data/`; production will use hosted Postgres.

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

- `agreements/`: a single owner logs in with `OWNER_PASSWORD` and gets an HMAC-signed httpOnly
  cookie (`SESSION_SECRET`). Create/cancel/list require it. The signing page `/s/<token>` is
  public but guarded by an unguessable 128-bit token, expires, can be signed once, and is `noindex`.

- The public catalog and Contact page do not require authentication.
- No org boundary exists in the current single-business public-site runtime.
- If a backend or multi-org admin surface is introduced, authentication and org scoping
  must be enforced there before database access.

## External Dependencies

- The Contact page's `ContactMap` component embeds a Google Maps `output=embed` iframe to
  show the factory's real location, plus static Google Maps and Waze deep links for
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

- 2026-11-26: Accessibility, IS 5568 / WCAG AA (`.plan/024-2026-11-26-accessibility-is5568.md`).
  New static route `/[locale]/accessibility` (accessibility statement, text in the
  `AccessibilityPage` messages), linked from the footer. Every page's `<main>` has
  `id="main-content"`, which the skip link in `[locale]/layout.tsx` targets. Global
  `:focus-visible` ring, `prefers-reduced-motion` and `.visually-hidden` live in
  `globals.css`. `e2e/accessibility.spec.ts` runs axe (A/AA) on every page in he/en/ru. When
  a page is added, add it to that spec and update the statement's `updated` date.

- 2026-11-26: Homepage and footer cleanup (`.plan/023-2026-11-26-hero-footer-font-cleanup.md`).
  `OurFactory` was taken off the homepage until more photos exist. The component and its data are
  kept. The footer lost the non-link "info" column, the placeholder visitor count and the
  unverified accessibility badge. The Hebrew fonts are now Noto Serif Hebrew (display) and
  Assistant (body). RU keeps Noto Serif/Sans.
- 2026-11-25: Hebrew content round 1 (`.plan/022-2026-11-25-hebrew-content-expansion.md`). Homepage
  is now `Hero` → `RecentWork` → `OurFactory` → `CategoryTiles` → … ; the hero and the new
  `OurFactory` strip read their photos from `frontend/src/data/factory-photos.ts`
  (`public/images/factory/`) and render a captioned `PhotoPlaceholder` until a file is set.
  Category pages render 4 "about this stone" blocks from `Categories.<slug>.sections`
  in messages. FAQ trimmed to 2 questions; "studio" wording replaced by "factory".
- 2026-11-25: Catalog, category gallery and Contact pages redesigned photo-first
  (`.plan/021-2026-11-25-catalog-contact-visual-redesign.md`). The catalog now reuses
  `CategoryTiles` (`size="large"`) and ends with `ContactBand`; category pages end with a
  "more stone types" `CategoryTiles` strip + `ContactBand`. Contact page leads with call /
  WhatsApp buttons in `ContactHero`. Removed `CatalogGrid`, `CatalogFilters`, `BackLink` and the
  stock `contact-workshop.webp`. Category ids/order moved from
  `components/CatalogGrid/categories.ts` to `src/data/categories.ts`.
- 2026-11-25: Homepage redesigned photo-first (`.plan/020-2026-11-25-homepage-visual-redesign.md`):
  `Hero` → `RecentWork` → `CategoryTiles` → `ProcessSteps` → `FamilyNote` → `ContactBand`.
  `MaterialsGrid` and `ServiceArea` components removed; FAQ moved to the Contact page
  (`/contact#faq`); a mobile-only `WhatsAppFab` renders on every page from the locale layout.
  Homepage photos come from `frontend/src/data/gallery.ts` (`featured` order). External links
  added: `wa.me` WhatsApp deep link (no API, no credentials).
- 2026-11-22: Added the separate `agreements/` app (owner-created signing links, canvas signature,
  Israeli ID check, no SMS OTP, Hebrew only). No change to the public site.
- 2026-07-28: Removed the `frontend/scripts/gallery-import.ts` Google Photos/Anthropic gallery
  curation CLI added 2026-07-23 below. The account owner chose to blur engraved text manually
  instead of relying on automated detection, which repeated real-photo testing showed missed
  text often enough to require full manual review regardless — see
  `.plan/011-2026-07-23-google-photos-gallery-headstone-blur.md` (status: abandoned) for the
  outcome. `frontend/public/images/gallery/` now exists as a plain destination folder for
  manually curated and manually blurred photos; no code or external integration is involved.
- 2026-07-23: Added `frontend/scripts/gallery-import.ts`, a local-only CLI (Google Photos Picker
  API OAuth + Anthropic vision classification/text-region detection + `sharp` blurring) that
  stages privacy-reviewed candidate gallery images for manual promotion; no public route or
  page was added (`.plan/011-2026-07-23-google-photos-gallery-headstone-blur.md`). Removed
  2026-07-28, see above.
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
