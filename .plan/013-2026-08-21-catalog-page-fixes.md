# Plan: Fix non-functional elements on the Catalog page

Status: done
Owner: Orchestrator
Last updated: 2026-08-21

## Context

Audited `/catalog` and `/catalog/[slug]` end to end (page, filters, pagination, category
galleries) plus the one adjacent route that shares the same "looks interactive but isn't"
pattern (`/product/[slug]`). Findings below, then a recommended plan.

### What already works

- `/catalog` — 4 category cards (שיש טורקי / שיש חברוני / גרניט / מיוחדות) with real
  thumbnails, correct links to `/catalog/<slug>`. (`CatalogGrid.tsx`)
- `/catalog/[slug]` — real curated, blurred installation photos per category
  (`frontend/src/data/gallery.ts`, 48 photos) in a responsive grid with a working
  click-to-enlarge lightbox (`CategoryGallery.tsx`). This shipped under
  [012](.plan/012-2026-07-30-catalog-material-gallery.md) — the backlog checkbox is stale
  and should be ticked off as part of this work.
- Breadcrumbs, Header/Footer, Contact CTAs all resolve correctly.

### What's broken / fake

1. **`CatalogFilters` sidebar is 100% non-functional by original design** — 4 material
   checkboxes, 2 style checkboxes, and a price slider are all rendered `disabled`
   (`CatalogFilters.tsx:24,44,74`). This was an explicit, documented decision in
   [003](.plan/003-2026-07-19-catalog-page.md) ("Functional filtering... deferred until a
   catalog data source exists") — not a regression, but the deferral was never followed up.
   This is almost certainly the "filter" the request refers to.
2. **`Pagination` is hardcoded and fake** — always renders pages `[1, 2]` with page 1
   "active" and every button `disabled` (`Pagination.tsx:3-4,15,30`), regardless of how many
   categories exist. There are only 4 categories and there will never be a page 2 at this
   level — the control promises content that doesn't exist.
3. **No data exists to honestly back the style or price filters anywhere in the app.**
   Nothing in the codebase tags a design as קלאסי/מודרני or gives it a price except one
   hardcoded demo product. Wiring those two controls up "for real" isn't a coding task, it's
   missing content.
4. **The one place with enough real content to make filtering _matter_ is unfiltered:**
   category galleries hold 6–19 photos each (granite 11, hebron-marble 19, special 6,
   turkish-marble 12 — counted from `gallery.ts`), but `CategoryGallery` has no filtering at
   all, and nothing tags those photos with style.
5. **Adjacent, same-pattern bug (not in `/catalog` but worth fixing alongside it):**
   `/product/[slug]` (`frontend/src/app/product/[slug]/page.tsx`) is a fully built product
   detail page — but no link anywhere in the site points to it (`grep -rn "/product/"` across
   `src` returns nothing outside the route itself). It's dead code today. Worse, if reached
   directly, its "related products" section links to three slugs
   (`art-combined`, `red-rock-granite`, `hebron-processed`, `turkish-classic`) that don't
   exist in `PRODUCTS` (`frontend/src/data/products.ts` has exactly one entry,
   `black-absolute-granite`) — every related-product click 404s.

## Goal

Make every interactive-looking control on `/catalog` and `/catalog/[slug]` either genuinely
work or not exist — no more controls that render as clickable but are `disabled`, and no
pagination/filter chrome promising content the site doesn't have.

## Recommended direction

Move real filtering to where there's real content to filter (the category galleries), and
remove fake chrome from the page that structurally can never need it (4 fixed cards never
need pagination or a material filter — the cards _are_ the material list).

- **On `/catalog` (4 cards):**
  - Remove `Pagination` entirely — 4 items on one page will never paginate; keep the
    component file for later reuse only if a real multi-page list ever exists, but don't
    render it here.
  - Remove the material checkboxes and price slider from `CatalogFilters` — the material
    list _is_ the page (checking "שיש טורקי" to filter a page that's already just the 4
    category cards, one of which is שיש טורקי, filters nothing meaningful). Keep the CTA box
    (`ייעוץ אישי מהלב`) — that part already works and isn't decorative.
- **On `/catalog/[slug]` (6–19 photos each):** add a real, working style filter
  (קלאסי / מודרני), reusing the exact low-risk manual-tagging pattern already proven in
  [012](.plan/012-2026-07-30-catalog-material-gallery.md): extend the `GALLERY_PHOTOS`
  manifest with a `style` field, tag each of the 48 photos by eye (owner corrects mistakes
  later by editing a line — no re-review gate, same as the category tagging), and add two
  toggle buttons above the grid that filter client-side. This is the one place on the
  catalog flow where a filter has enough content to be worth clicking.
- **`/product/[slug]`:** out of scope for "catalog page" itself, but flagged because it's the
  same "fake/broken interactive element" pattern the user asked about. Decide separately
  whether to (a) link it in somewhere real, or (b) delete the orphaned route + demo data
  until there's an actual per-design catalog. Tracking as its own backlog line, not built
  here.

## Scope

- In scope:
  - Remove `<Pagination />` from `frontend/src/app/catalog/page.tsx`.
  - Simplify `CatalogFilters.tsx`: drop the `סוגי מצבות` checkbox group and the price slider
    group; keep heading copy relevant to what remains (or drop the sidebar down to just the
    CTA box — see Open Question 1).
  - Add `style?: "classic" | "modern"` to `GalleryPhoto` in `frontend/src/data/gallery.ts`,
    tag all 48 entries (first-pass manual read, owner-correctable).
  - Add a small style-filter control to `CategoryGallery.tsx` (two toggle buttons, client-side
    filter of the existing `photos` array — no new dependency).
  - Update/replace `CatalogFilters.test.tsx` (currently asserts the removed controls exist
    and are disabled) and `frontend/e2e/catalog.spec.ts` (add a case that clicks the new style
    filter and asserts the grid narrows).
  - Tick the stale `012` backlog line in `.plan/000-backlog.md` as done; add a new backlog
    line for the `/product/[slug]` orphan decision.
- Out of scope:
  - Any change to `/product/[slug]` itself, `RelatedProducts`, or `products.ts` — flagged
    above, tracked separately, not touched in this plan.
  - A real multi-item, price-tagged SKU catalog per category (what would be needed to make
    the _original_ Figma material/style/price filter set fully honest). This needs the owner
    to supply per-design photos + prices + style, which is a content project, not a bug fix —
    log as a new backlog item if wanted, don't build speculatively.
  - Cart/checkout/payment — still explicitly out of scope per the PRD.

## Assumptions

- "Style" (קלאסי/מודרני) is visually determinable from the existing 48 photos by eye, same
  confidence level as the category tagging in 012 (mistakes fixable later, no privacy
  stakes).
- No backend needed — style tag lives in the same static `gallery.ts` manifest as category.
- Removing controls that can never work is preferable to leaving them permanently `disabled`
  — a control that's always disabled has no path to ever becoming useful and just teaches
  visitors to ignore it.

## Open Questions

1. **What replaces the removed `CatalogFilters` groups?** _Recommended:_ sidebar keeps only
   the CTA box (`ייעוץ אישי מהלב` → `/contact`); drop the `heading`/`groupTitle` chrome that
   only existed to introduce the removed controls. Alternative: delete `CatalogFilters` as a
   sidebar entirely and inline the CTA box into the page layout — bigger layout change, more
   CSS rework, not recommended for this pass. do as recomended
2. **Where do the two style-filter buttons live on the category page?** _Recommended:_ a
   small toggle row directly above the photo grid in `CategoryGallery.tsx`, same component
   that already owns the grid/lightbox state — no new component needed for two buttons. recomended
3. **Should the `/product/[slug]` orphan be fixed now or just logged?** _Recommended:_ log
   only — it's a different route family (individual SKU, not category), fixing it properly
   needs the same "is there a real SKU catalog" decision as Open Question above in Out of
   Scope, and bundling it here would blow up this plan's size for a tangential bug.
   recomended

## Steps

1. `frontend/src/data/gallery.ts`: add `style` field to `GalleryPhoto`, tag all 48 photos.
2. `frontend/src/components/CategoryGallery/CategoryGallery.tsx`: add style toggle state +
   two buttons (`הכל` / `קלאסי` / `מודרני` or similar), filter `photos` before rendering,
   keep existing lightbox behavior working against the filtered set.
3. `frontend/src/components/CatalogFilters/CatalogFilters.tsx`: remove the `סוגי מצבות`
   fieldset and the price-range group; keep the CTA box.
4. `frontend/src/app/catalog/page.tsx`: remove the `<Pagination />` render (keep the
   component file itself untouched for potential future reuse).
5. Update `CatalogFilters.test.tsx` to match the trimmed component; add a test file/cases for
   the new style filter in `CategoryGallery.test.tsx`; update `frontend/e2e/catalog.spec.ts`.
6. `.plan/000-backlog.md`: check off the 012 line, add a new unchecked line for the
   `/product/[slug]` orphan-route decision.

## Validation

- `npx vitest run`, `npm run lint`, `npx tsc --noEmit`, `npm run build` all pass.
- Manual walkthrough: `/catalog` shows 4 cards, no pagination, sidebar shows only the CTA;
  each category page's style toggle actually narrows the visible photos and the lightbox
  still opens/closes correctly on the filtered set; mobile viewport check.

## Risks

- Style tagging is a manual visual read, same low-stakes/correctable risk profile as the
  category tagging in 012 — expect a few wrong tags, fine to fix by editing one line later.
- Removing the material/price filter UI is a visible design change from the original Figma
  frame (`12:357`) — flag to the owner as an intentional deviation (fake controls removed
  because there's no data to back them), not an oversight.

## Rollout Order

1. Review this plan / confirm the "remove fake, add real where content exists" direction
   (or redirect — see Open Questions).
2. Implement steps 1–4.
3. Update tests (step 5), run full validation suite.
4. Update backlog (step 6).
5. Merge.

## Rollback

- Revert the four touched files (`gallery.ts`, `CategoryGallery.tsx`, `CatalogFilters.tsx`,
  `catalog/page.tsx`) plus their tests. No data migration involved — everything is static
  TS/TSX.
