# Plan: Contact page

Status: done
Owner: Orchestrator
Last updated: 2026-07-19

> Supersedes `.plan/005-2026-07-19-contact-page.md`. This revision folds in the answers
> the user recorded inline on plan 005's Open Questions (interactive form + simulated
> delivery; leave `Header` as-is; follow Figma for form fields + add an email detail line
> with `dovalper16@gmail.com`; map placeholder + external navigate link; log-only delivery).

## Goal

Build the Alper Marble Contact page: a Hebrew/RTL page (PRD Screen 4, F3/F4, AC-1/AC-3)
that lets a visitor reach the business by phone, email, address/map, and a contact form.
The layout is a centered hero (`ייעוץ אישי מהמשפחה שלנו` + gold divider + subtitle), a
two-column main grid (an interactive inquiry form plus direct address/phone cards on one
side, a location-map placeholder + workshop image on the other), and a full-width
three-item "trust" band (`עיצוב אישי` / `שקיפות מלאה` / `אחריות לדורות`). Reuses the shared
`Header` and `Footer`. The contact form captures name, phone, preferred contact time, and
message, and delivers the inquiry through a simulated/local delivery path (AC-3). No cart,
checkout, or payment UI anywhere (PRD F5 / AC-4).

## Selected Figma Frames

Frame re-inspected this session via Figma MCP `get_design_context`
(fileKey `AUIumATzMjmGOSLtUWbzqG`) — screenshot confirms the two-column form + map layout,
info cards, trust band, and shared header/footer.

- `Contact (RTL Verified)` — node `12:2`
  (https://www.figma.com/design/AUIumATzMjmGOSLtUWbzqG/stones?node-id=12-2)
- Notable sub-nodes within that frame:
  - Header - TopNavBar — `12:113` (brand `אלפר מצבות`, nav with `צור קשר` active + gold
    underline, `דברו עם המשפחה שלנו` CTA, `עברית | EN | RU` switcher) — matches shared `Header`.
  - Main container — `12:3`
  - Hero / Header Section — `12:4`: `h1` `ייעוץ אישי מהמשפחה שלנו` (32px) — `12:6`; gold
    (`#725b27`) 64px divider — `12:7`; subtitle `אנו כאן כדי ללוות אתכם ברגעים הרגישים ביותר,
במקצועיות, רגישות והקפדה על כל פרט ופרט.` — `12:9`.
  - Section - Main Grid (12-col, 32px gap) — `12:10`
    - Contact Info & Form (cols 6–12, on the **left** in RTL) — `12:11`
      - Form card (bg `#f5f3ee`, border `#c4c7c7`) — `12:12` / `12:13`
        - Row: `מספר טלפון` input (placeholder `050-0000000`) — `12:15`; `שם מלא` input
          (placeholder `ישראל ישראלי`) — `12:21`
        - `זמן מועדף ליצירת קשר` select (value `בוקר (08:00 - 12:00)`) — `12:27`
        - `הודעה / בקשה מיוחדת` textarea (placeholder `כיצד נוכל לעזור?`) — `12:38`
        - Submit button (dark `#1b1815`) `שליחת בקשה למשפחה` — `12:44`
      - Two info cards (bg `#f0eee9`, border) — `12:46`
        - `כתובת הסטודיו` → `רחוב החרש 12, אזה"ת חולון` + pin icon — `12:47`
        - `טלפון ישיר` → `03-555-8291` + phone icon — `12:55`
    - Map & Workshop Visual (cols 1–5, on the **right** in RTL) — `12:63`
      - Location Map Placeholder (aspect-square, desaturated) with overlay card: `ניווט`
        link — `12:68`, `סטודיו ובית מלאכה` / `פתוח בין השעות 08:30 - 17:30` — `12:73`
      - Atmospheric Workshop Image (256px) — `12:78`
  - Trust Section (bg `#f5f3ee`, top+bottom border) — `12:79`: 3 items, each icon (Material
    Symbols `draw` / `visibility` / `verified_user`, gold) + `h3` + description:
    - `עיצוב אישי` (`12:81`) — `כל אנדרטה מתוכננת יחד אתכם כדי להנציח את הסיפור האישי.`
    - `שקיפות מלאה` (`12:87`) — `עדכונים שוטפים וצילומים לאורך כל תהליך הייצור וההקמה.`
    - `אחריות לדורות` (`12:93`) — `אנו מתחייבים לאיכות האבן והעבודה לאורך עשרות שנים.`
  - Footer — `12:99` (matches shared `Footer`).

## Scope

- In scope:
  - Replace the Contact stub (`frontend/src/app/contact/page.tsx` +
    `frontend/src/app/contact/page.module.css`, which currently render only an
    `<h1>צור קשר</h1>`) with the full layout, composing
    `<Header/> <main>(hero + two-column grid + trust band)</main> <Footer/>`.
  - New presentational components under `frontend/src/components/` (each its own folder with
    `.tsx`, `.module.css`, `.test.tsx`, matching the existing component convention):
    - `ContactHero` — centered `h1`, gold divider, subtitle paragraph.
    - `ContactForm` — **interactive** client component (`"use client"`, decision from Q1):
      controlled fields `שם מלא` (name), `מספר טלפון` (phone), `זמן מועדף ליצירת קשר`
      (preferred-time `<select>`), `הודעה / בקשה מיוחדת` (message textarea), submit button
      `שליחת בקשה למשפחה`, with client-side required validation, a submitting/disabled state,
      and a success/error message region (`aria-live`). POSTs to the Contact route handler.
    - `ContactDetails` — the two info cards (`כתובת הסטודיו`, `טלפון ישיר`) with inline-SVG
      icons; phone rendered as a `tel:` link, address as an external maps link, plus an
      email line rendered as a `mailto:` link (decision from Q3).
    - `ContactMap` — location-map **placeholder** block (neutral desaturated block, same
      placeholder-imagery approach as Homepage/Catalog — `// TODO: replace with real map`)
      with the overlay card (`ניווט` external navigate link, `סטודיו ובית מלאכה`, hours) plus
      the atmospheric workshop image placeholder.
    - `TrustHighlights` — full-width band with 3 items (inline-SVG icon + `h3` + description).
  - Contact inquiry delivery (PRD F4 / AC-3): a Next.js **route handler**
    `frontend/src/app/api/contact/route.ts` (POST) that validates the payload and performs a
    **simulated/local delivery** — logs the inquiry server-side and returns a success JSON.
    A `// TODO:` marks where real email delivery (e.g. SMTP/provider) plugs in later.
  - Contact data (address, direct phone, hours, studio label, email, maps URL, and the
    preferred-time options) as a small module-level constant
    (`frontend/src/data/contact.ts`) so copy stays editable and is shared by the form,
    details, and route handler.
  - RTL layout consistent with `dir="rtl"`, `lang="he"` already set in the root layout; reuse
    shared `Header` and `Footer` (no forking).
  - Unit tests (Vitest + RTL) for `ContactHero`, `ContactForm` (renders fields; required
    validation blocks empty submit; successful submit calls the endpoint and shows success),
    `ContactDetails`, `ContactMap`, `TrustHighlights`. Playwright smoke test for `/contact`
    (loads, form fields present, submitting a filled form shows the success state, no console
    errors, no cart/checkout/payment UI).
- Out of scope:
  - Real email/SMS delivery infrastructure (no `backend/` exists; the repo is frontend-only).
    The route handler simulates delivery per AC-3's "clear simulated/local delivery path during
    development"; wiring a real provider is a follow-up.
  - A real, interactive/embedded map (Google Maps JS embed, API keys). This task ships a map
    **placeholder** with an external "navigate" link (decision from Q4); a live embed is
    deferred.
  - The language switcher (visual-only, already inert in shared `Header`) and any `Header`
    per-page active-state refactor (decision from Q2 — logged as a follow-up).
  - Persisting inquiries to a database / CRM; spam protection (captcha/rate-limiting) beyond
    basic required-field validation — follow-ups once a real delivery path exists.
  - Changes to Homepage, Catalog, Product, `Header`, or `Footer` beyond what already exists.
  - Any online ordering, cart, checkout, or payment (PRD F5 / AC-4) — never introduced.

## Assumptions

- Figma source is frame `12:2` "Contact (RTL Verified)"; layout, copy, and tokens below are
  taken directly from it via Figma MCP `get_design_context` (verified this session).
- `frontend/` exists; Homepage, Catalog, and Product pages are implemented. Components present
  under `frontend/src/components/` (each with `.tsx` + `.module.css` + `.test.tsx`): `Header`,
  `Footer`, `Hero`, `Philosophy`, `MaterialsGrid`, `ProcessSteps`, `Breadcrumb`, `CatalogGrid`,
  `CatalogFilters`, `Pagination`, `ProductGallery`, `ProductOptions`, `ProductPricing`,
  `TechnicalDetails`, `RelatedProducts`. Routes present: `/`, `/catalog`, `/catalog/[slug]`,
  `/product/[slug]`, `/contact` (stub). This task fills in `/contact`. There is **no `backend/`**
  — content is static and delivery is simulated. `frontend/src/data/` currently holds only
  `products.ts`; this task adds `contact.ts`.
- Verified tooling this session: Next.js `16.2.10`; Vitest configured (`vitest.config.ts`);
  Playwright configured (`playwright.config.ts`) with e2e specs in `frontend/e2e/`
  (`homepage.spec.ts`, `catalog.spec.ts`, `product.spec.ts`) — this task adds `contact.spec.ts`.
- `frontend/AGENTS.md` warns this Next.js has breaking changes vs. training data; the
  implementer MUST read the relevant guides under `frontend/node_modules/next/dist/docs/`
  before writing the client component and the route handler (App Router: Route Handlers, and
  Client Components / `"use client"`), and follow existing route/page patterns.
- The Contact page has **no breadcrumb** in Figma (unlike Catalog/Product), so none is added.
- The shared `Header`/`Footer` are reused as-is. The Figma frame highlights `צור קשר` as the
  active nav item with a gold underline, but the shared `Header` currently hard-codes `בית`
  as active (decision from Q2: leave as-is, log follow-up).
- Design tokens observed in the frame (reuse existing globals where already defined):
  - Page background `#fbf9f4`; form card / trust band `#f5f3ee`; info cards `#f0eee9`;
    input fields `#fbf9f4`; map placeholder `#e4e2dd`.
  - Text: heading `#181919` / `#1b1c19`; body/muted `#444748`; accent/link `#725b27`;
    placeholder `#6b7280`; light-on-dark `#ffffff`.
  - Borders `#c4c7c7`; inputs use a bottom border only; submit button fill `#1b1815`.
  - Fonts: Figma uses "Liberation Serif" (headings/labels/body), "Noto Sans"/"Noto Serif"
    (input values, phone number). Approximate with the site's existing `Noto Serif Hebrew` +
    serif/sans fallbacks — not pixel-matching.
- Placeholder imagery is used for the map and workshop image; real map + photography are a
  follow-up once provided. Do not download the 7-day Figma asset URLs.

## Open Questions

_All open questions were answered on plan 005 (inline `recomended` marks). Decisions are
locked below; kept for the record. Re-flag only if a decision needs to change._

1. **Is the contact form interactive, or visual-only like the filters/language switcher?**
   **Decision: interactive + simulated delivery.** The contact form is a core functional
   requirement (PRD F4, AC-3), not decorative. Implement it as a client component with
   controlled inputs, required-field validation, a disabled/submitting state, and a
   success/error region, posting to `frontend/src/app/api/contact/route.ts` which **simulates
   delivery** (logs the inquiry, returns 200).
2. **Should the nav's active item become per-page (so `צור קשר` is active on Contact)?**
   **Decision: leave `Header` as-is for this task** to avoid regressing other pages and match
   the prior plans' "don't fork the shared header" decision; treat per-page active state as a
   small, separate `Header` enhancement. The `אלפר מצבות` vs `שיש אלפר` brand-label nit and the
   active-state mismatch are logged as non-blocking design follow-ups.
3. **The Figma form has no email field, but PRD Screen 4 lists an email address.**
   **Decision: follow Figma for form fields** (name/phone/time/message, no email input) and
   satisfy PRD F3's "reach via email" by adding an **email contact line** to `ContactDetails`
   (a `mailto:` link styled like the other detail cards). Email address: `dovalper16@gmail.com`
   (confirmed by the user) in `contact.ts`.
4. **Real map vs. placeholder?** **Decision: ship a placeholder** block (consistent with the
   site's placeholder-imagery approach; avoids Google Maps keys/CSP work) whose `ניווט` link
   opens an external Google Maps directions URL for the address in a new tab. A live embedded
   map is a follow-up.
5. **Where does the submitted inquiry go with no backend?** **Decision: simulated/local
   delivery** — the route handler validates and logs the payload server-side, returning a
   success JSON the form surfaces as `בקשתכם נשלחה...`. A `// TODO:` marks the real-delivery
   seam. No database, no third-party provider in this task.

## Steps

1. Read the relevant Next.js 16 guides under `frontend/node_modules/next/dist/docs/` (Route
   Handlers, Client Components) before writing code; follow existing page/component patterns.
2. Add contact data constant `frontend/src/data/contact.ts`: `addressLine`
   (`רחוב החרש 12, אזה"ת חולון`), `directPhone` (`03-555-8291`), `hours`
   (`פתוח בין השעות 08:30 - 17:30`), `studioLabel` (`סטודיו ובית מלאכה`), `email`
   (`dovalper16@gmail.com`, decision Q3), `mapsUrl` (external directions link, decision Q4), and
   the preferred-time options (`בוקר (08:00 - 12:00)` and the rest).
3. Build `ContactHero` (`frontend/src/components/ContactHero/`): centered `h1`
   `ייעוץ אישי מהמשפחה שלנו`, 64px gold divider, subtitle paragraph.
4. Build `ContactForm` (`frontend/src/components/ContactForm/`, `"use client"`, decision Q1):
   labeled fields `שם מלא`, `מספר טלפון`, `זמן מועדף ליצירת קשר` (`<select>`),
   `הודעה / בקשה מיוחדת` (`<textarea>`); required validation; submit button
   `שליחת בקשה למשפחה`; disabled/submitting state; `aria-live` success/error region; POSTs to
   `/api/contact`.
5. Add route handler `frontend/src/app/api/contact/route.ts` (POST, decision Q1/Q5): validate
   required fields, log the inquiry (simulated delivery), return success/error JSON. Mark the
   real-email seam with `// TODO:`.
6. Build `ContactDetails` (`frontend/src/components/ContactDetails/`): address card (pin icon,
   external maps link), direct-phone card (phone icon, `tel:` link), and email line (`mailto:`,
   decision Q3). Inline-SVG icons (no external icon font).
7. Build `ContactMap` (`frontend/src/components/ContactMap/`): placeholder map block + overlay
   card (`ניווט` external link, `סטודיו ובית מלאכה`, hours) + workshop image placeholder
   (`// TODO: replace with real map/photography`).
8. Build `TrustHighlights` (`frontend/src/components/TrustHighlights/`): full-width band, 3
   items (inline-SVG icon + `h3` + description) matching `עיצוב אישי` / `שקיפות מלאה` /
   `אחריות לדורות` with the exact copy captured in Selected Figma Frames.
9. Replace `frontend/src/app/contact/page.tsx` to compose `<Header/> <main>(ContactHero +
   two-column grid[ContactForm + ContactDetails | ContactMap] + TrustHighlights)</main>
   <Footer/>`; write `page.module.css` for the RTL 12-col grid (form side cols 6–12, map side
   cols 1–5) that collapses to a single column on mobile (PRD mobile/accessibility NFRs).
10. Confirm no cart/checkout/payment UI is introduced anywhere (PRD F5 / AC-4).
11. Write unit tests (Vitest + RTL): `ContactHero` (heading + subtitle), `ContactForm` (renders
    all fields; empty submit is blocked by validation; a filled submit calls the endpoint —
    mocked `fetch` — and shows the success message), `ContactDetails` (address/phone/email
    render with correct `tel:`/`mailto:` hrefs), `ContactMap` (placeholder + `ניווט` link),
    `TrustHighlights` (3 items).
12. Write a Playwright smoke test `frontend/e2e/contact.spec.ts`: `/contact` loads; hero, form,
    details, map, and trust band render; filling and submitting the form shows the success
    state; no console errors; no cart/checkout/payment UI.
13. Run `npx vitest run` and `npx playwright test`; fix failures before reporting done.

## Validation

- frontend unit: `cd frontend && npx vitest run`
- e2e: `cd frontend && npx playwright test --reporter=list`
- Manual: `cd frontend && npm run dev`, load `/contact`; confirm RTL hero + two-column
  form/map grid + trust band render and visually match Figma frame `12:2` (spot-check via
  screenshot compare). Submit the form with valid data and confirm the success message and a
  server-side log entry (simulated delivery, AC-3). Confirm phone/email/`ניווט` links work and
  no cart/checkout/payment UI exists (AC-4).

## Risks

- Simulated (log-only) delivery means real inquiries are not yet emailed to the business; the
  `// TODO:` seam must be obvious so the real provider is wired before production. (accepted)
- Hebrew serif/sans font fallback may shift text metrics vs. Figma pixel measurements —
  acceptable variance, not pixel-matching. (accepted)
- Map placeholder (no live embed) won't show a real location until a map integration or real
  image is added; the `ניווט` external link mitigates for now. (accepted)
- No spam protection on the form endpoint; acceptable for a simulated dev-only delivery path,
  flagged as a follow-up before real delivery is enabled. (accepted)
- Header active-state / brand-label mismatch (`צור קשר` not marked active; `שיש אלפר` vs
  `אלפר מצבות`) left as-is for cross-page consistency; designer sign-off pending. (accepted)
- Client component + route handler must follow Next 16 conventions (which differ from training
  data) — mitigated by reading `node_modules/next/dist/docs/` first. (accepted)

## Rollout Order

1. Frontend Agent: implement Contact route + `ContactHero`/`ContactForm`/`ContactDetails`/
   `ContactMap`/`TrustHighlights` components + `api/contact` route handler + `contact.ts` data
   + tests (no backend ticket — delivery is simulated).
2. QA Agent: run unit + e2e validation and visual spot-check against frame `12:2`; verify the
   simulated-delivery success path and AC-4 (no cart/checkout/payment).

## Rollback

- Revert branch `feat/contact-page` commits: restore `frontend/src/app/contact/page.tsx` +
  `page.module.css` to the stub; remove the new `Contact*` / `TrustHighlights` components, the
  `frontend/src/app/api/contact/` route handler, and `frontend/src/data/contact.ts`.
- Restore the backlog checkbox to unchecked and mark this plan `Status: superseded` if replaced
  by a revised plan.
