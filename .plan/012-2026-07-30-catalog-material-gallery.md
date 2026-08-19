# Plan: Real installation photos on the per-material Catalog category pages

Status: draft
Owner: Orchestrator
Last updated: 2026-07-30

> **Context:** plan [011](.plan/011-2026-07-23-google-photos-gallery-headstone-blur.md)'s automated
> detection/blur pipeline was abandoned 2026-07-28 — the owner blurs engraved names manually before
> adding photos. 48 manually curated, manually blurred photos now exist at
> `frontend/public/images/gallery/`. This plan originally proposed a standalone `/gallery` page, but
> the owner pointed out a better fit: `/catalog` already renders 4 category cards — שיש טורקי
> (`turkish-marble`), שיש חברוני (`hebron-marble`), מצבות אבן גרניט (`granite`), מצבות מיוחדות
> (`special`) — see `frontend/src/components/CatalogGrid/categories.ts`. Each card links to
> `frontend/src/app/catalog/[slug]/page.tsx`, which is **already a stub** whose own comment says
> "the full per-category gallery... is a separate backlog task" and renders "גלריית הדגמים תתווסף
> בקרוב" (gallery coming soon). This plan is that backlog task: show the curated real photos,
> filtered by which of these 4 categories they belong to, on the page that's already wired up for
> exactly this. **No blurring work is in scope** — that's done and stays a manual step per 011.

## Goal

When a visitor clicks a material category on `/catalog` (e.g. שיש טורקי), take them to a page
showing real, curated photos of memorial stones the business has actually built in that material —
replacing today's "coming soon" stub with real content, using the existing category routing.

## Scope

- In scope:
  - A manifest tagging each file in `frontend/public/images/gallery/` with one of the 4 existing
    category slugs from `categories.ts` (`turkish-marble`, `hebron-marble`, `granite`, `special`).
  - Replacing the stub body of `frontend/src/app/catalog/[slug]/page.tsx` with a responsive photo
    grid of that category's tagged photos.
  - Click-to-enlarge (lightbox) viewing of a photo.
  - A CTA back to Contact on the category page, so it isn't a dead end (PRD AC-1: no dead ends).
- Out of scope:
  - Wiring up `CatalogFilters`' disabled material/style checkboxes on the flat `/catalog` page —
    those are a separate, pre-existing inert control tied to (future) individual SKU filtering, not
    to these real-work photos. Not touched here.
  - Any automated blur/classification pipeline — removed in plan 011; new photos are still added to
    the folder by hand, same as today.
  - A new top-level `/gallery` route or Header nav entry — this direction replaces that idea, since
    `/catalog` → category card is already the entry point.
  - `docs/PRD.md` / `.doc/product-definition.md` updates — the Catalog page and its per-category
    drill-down are already in scope in both docs; this fills an existing stub, not new product
    scope.

## Assumptions

- No backend/database; a static manifest (a small TS array) mapping filename → category, read at
  build time, matching the rest of the site's static-content approach.
- The 48 images currently in `frontend/public/images/gallery/` are final/safe to publish (already
  manually reviewed and blurred by the owner) — this plan does not re-review them.
- Category tagging below was done by eyeballing each photo (visual read of stone color/texture/cut
  — polished white/grey = Turkish marble, rough-hewn cream/beige = Hebron stone, dark polished
  speckled = granite, custom painted/carved/sculptural = special), **not** a re-run of any
  automated classifier. Per the owner (2026-07-30): mistakes are expected and fine to correct later
  by editing the manifest — no re-review gate needed before shipping, unlike the blur-safety gate in
  plan 011 (a wrong material tag has no privacy consequence, unlike an unblurred name).

## Draft photo → category tagging (first pass — please correct any mistakes)

| Category (slug) | Files |
|---|---|
| שיש טורקי (`turkish-marble`) | gallery-31, 34, 37, 46, 54, 56, 63, 66, 75, 77, 79, 81 |
| שיש חברוני (`hebron-marble`) | gallery-11, 21, 24, 55, 57, 58, 59, 60, 61, 62, 65, 69, 71, 73, 76, 80, 85, 87, 88 |
| מצבות אבן גרניט (`granite`) | gallery-05, 08, 53, 68, 70, 82, 83, 84, 86, 89, 90 |
| מצבות מיוחדות (`special`) | gallery-16, 64, 67, 72, 74, 78 |

## Open Questions

1. **Layout of the category page.**
   _Recommended:_ keep the existing title/description header, replace the "coming soon" paragraph
   with a responsive grid of that category's photos (similar density to `CatalogGrid`) + lightbox.
   No captions (no per-photo metadata beyond category), no pagination — largest category is 19
   photos.

2. **Image loading.**
   _Recommended:_ Next.js `<Image>` for optimization/lazy-loading — real JPEGs at 200–700KB each.

3. **Dead-end CTA.**
   _Recommended:_ add a "בקשת ייעוץ" (request consultation) link to `/contact` at the bottom of
   each category page, consistent with PRD AC-1 (no dead ends) and the existing Header CTA copy.

4. **Ordering within a category.**
   _Recommended:_ fixed order (sorted by filename), not random-per-load.

## Steps

1. Add `frontend/src/data/gallery.ts`: an array of `{ file: string; category: CategorySlug }` for
   every file in `frontend/public/images/gallery/`, using the tagging table above.
2. Build a `CategoryGallery` (or similarly named) component: responsive grid of `<Image>` thumbnails
   filtered to one category + click-to-open lightbox.
3. Replace the stub body in `frontend/src/app/catalog/[slug]/page.tsx` with `CategoryGallery`
   (passed the resolved category) + a Contact CTA, keeping the existing title/breadcrumb.
4. Tests: manifest covers every file in the folder with a valid category (no orphans, no invalid
   slugs); `CategoryGallery` renders exactly the matching subset per category; lightbox open/close.
5. Manual QA: click through all 4 category cards from `/catalog`, confirm the right photos show,
   check mobile viewport width (NFR: mobile legibility).

## Validation

- `npx vitest run`, `npm run lint`, `npx tsc --noEmit`, `npm run build` all pass.
- Manual walkthrough: `/catalog` → each of the 4 category cards → photos + lightbox → Contact CTA.

## Risks

- **Tagging accuracy**: the category table above is a manual visual read, not guaranteed perfect —
  low-stakes and owner-correctable (edit one line in `gallery.ts`), unlike plan 011's blur-safety
  risk.
- **Image weight**: mitigated by `next/image` lazy-loading.
- **Scope confusion with `CatalogFilters`**: that component's checkboxes look related but are
  intentionally left inert/untouched here — worth a short code comment so a future reader doesn't
  assume they already drive this page.

## Rollout Order

1. Approve this plan / the tagging table above.
2. Implement manifest + `CategoryGallery` + stub replacement.
3. Tests + manual QA.
4. Merge.

## Rollback

- Revert `frontend/src/app/catalog/[slug]/page.tsx` to its "coming soon" stub and remove
  `frontend/src/data/gallery.ts` / `CategoryGallery`. The images themselves are unaffected either
  way.
