# Plan: Homepage

Status: active
Owner: Orchestrator
Last updated: 2026-07-18

## Goal

Build the Matzevot (Alper Matzevot) marketing Homepage: a Hebrew/RTL informational
page that introduces the family business, showcases material/style categories, explains
the service process, and drives visitors to the Catalog and Contact pages. No cart,
checkout, or payment UI (PRD F5).

## Scope

- In scope:
  - `frontend/` app scaffold (Next.js App Router + TypeScript), first task so this is greenfield.
  - Homepage route (`/`) with sections: Header/Nav, Hero, Intro/Philosophy, Featured
    Materials (Bento grid of 3 cards), Process (4-step "our process"), Footer.
  - RTL layout (`dir="rtl"`, `lang="he"`), Hebrew copy taken from Figma.
  - Static content only — hero image, philosophy image, and 3 material thumbnails as
    simple placeholder imagery, no CMS/backend data needed.
  - Links from Hero CTA and header nav to `/catalog` and `/contact` routes (routes can be
    stub pages created in later backlog tasks; link targets should not 404 the build).
  - Unit tests for the Homepage component; Playwright smoke test for page load + nav
    links.
- Out of scope:
  - Catalog, Product Detail, Contact page content (separate backlog items).
  - Contact form submission / backend inquiry API (separate backlog item, needs
    `contact_inquiry` data model per PRD).
  - Language switcher functionality (RU | EN | עברית shown in Figma header, but only
    Hebrew/RTL is implemented now — switcher is visual-only / non-functional).
  - Visitor counter ("מבקרים: 12,482") — static placeholder text only, no real tracking.

## Assumptions

- Figma source for this task: https://www.figma.com/design/AUIumATzMjmGOSLtUWbzqG/stones?node-id=12-531
  (frame "Homepage (RTL Verified)", node 12:531). Frame was inspected via Figma MCP
  `get_design_context`; layout, copy, and design tokens below are taken directly from it.
- `frontend/` does not exist yet — this is the first implementation task, so the
  Frontend Agent scaffolds the Next.js app per `agents/frontend/CLAUDE.md` Step 2.
- `backend/` is not needed for this task (no dynamic data on the Homepage).
- Fonts: Figma uses "Liberation Serif" (headings/body) and "Noto Serif"/"Noto Sans"
  (numeric labels, nav language switcher). Approximate with web-safe/Google Fonts
  equivalents (e.g. `Noto Serif Hebrew`, `Liberation Serif` fallback to `Georgia`/serif)
  since exact license availability is unconfirmed — call out as an Open Question.
- Images: not sourced from Figma for this task. Frontend Agent uses simple placeholder
  imagery (e.g. neutral placeholder blocks/divs or a placeholder image service) for the
  hero, philosophy, and material cards; real photography is a follow-up once the client
  provides it.

## Open Questions

All resolved — accepted recommended answers below (see risk sign-off in Risks section).

1. ~~Should `/catalog` and `/contact` be created as minimal stub pages in this task?~~
   **Resolved:** yes, create minimal stub pages (placeholder heading only) now, fully
   implemented by their own later backlog tasks.
2. ~~Exact font for Liberation Serif / Noto Serif?~~ **Resolved:** use Google Fonts
   `Noto Serif Hebrew` via `next/font/google`, since Liberation Serif has no Hebrew
   coverage.
3. ~~Real photography not available yet?~~ **Resolved:** skip downloading the
   Figma-exported images; use simple placeholders (solid-color/neutral placeholder
   blocks or a placeholder image service) instead, flagged with a code comment
   `// TODO: replace with client-provided photography`.

## Steps

1. Frontend Agent scaffolds `frontend/` (Next.js App Router, TS, no Tailwind per
   `agents/frontend/CLAUDE.md`) if not already present.
2. Set root layout `frontend/src/app/layout.tsx` with `<html lang="he" dir="rtl">` and
   global RTL-aware styles in `app/globals.css`.
3. Build Homepage sections as components under `frontend/src/app` (or
   `frontend/src/components`), matching Figma frame 12:531:
   - `Header` (nav links, language switcher visual, "בקשת ייעוץ" CTA button)
   - `Hero` (heading, subheading, two CTA buttons → Catalog / brand story anchor)
   - `Philosophy` (image + heading + body + 2 stat callouts: "נצחיות" / "40+")
   - `MaterialsGrid` (3 cards: Basalt, Marble, Granite — image, title, excerpt, link)
   - `ProcessSteps` (4-step numbered list: פגישת ייעוץ, תכנון ועיצוב, ייצור אומנותי,
     הצבה בשטח)
   - `Footer` (link columns, brand blurb, social icons, copyright bar)
4. Create minimal stub pages `frontend/src/app/catalog/page.tsx` and
   `frontend/src/app/contact/page.tsx` (placeholder heading only) so Homepage links
   resolve; full implementation is each page's own later backlog task.
5. Use placeholder imagery for hero, philosophy, and material card images (no Figma
   asset download needed for this task).
6. Define `docs/api-contract.yaml` only if any dynamic content is needed — expected
   empty/no-op for this task since Homepage is static.
7. Write unit tests (Vitest + RTL) for Hero, MaterialsGrid, ProcessSteps rendering
   expected copy and links.
8. Write a Playwright smoke test: page loads, header nav + hero CTAs point to expected
   hrefs, no console errors.
9. Run `npm test` and `npx playwright test`; fix failures before reporting done.

## Validation

- frontend: `cd frontend && npx vitest run`
- e2e: `cd frontend && npx playwright test --reporter=list`
- Manual: run `npm run dev` in `frontend/`, load `/`, confirm RTL layout renders
  correctly and matches Figma frame 12:531 visually (spot-check via screenshot compare).

## Risks

- Hebrew font fallback may shift text metrics vs. Figma pixel-perfect measurements —
  acceptable variance, not pixel-matching. accept
- Placeholder imagery means the shipped Homepage won't visually match Figma's stock
  photos exactly until real photography is swapped in. accept
- Stub `/catalog` and `/contact` routes (if created) must not conflict with the actual
  implementations built in their own backlog tasks — keep them minimal placeholders only. accept

## Rollout Order

1. Frontend Agent: scaffold + Homepage implementation + tests (this task has no backend
   ticket since there's no dynamic data).
2. QA Agent: run unit + e2e validation.

## Rollback

- Revert branch `feat/homepage` commits.
- Restore `.plan/000-backlog.md` checkbox to unchecked and mark this plan
  `Status: superseded` if replaced by a revised plan.
