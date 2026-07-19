# Plan: Product Detail page

Status: done
Owner: Orchestrator
Last updated: 2026-07-19

## Goal

Build the Alper Marble Product Detail page: a Hebrew/RTL page that presents a single
memorial-stone design with a photo gallery, configurable options display
(category / decorative symbol / engraving preview), a base price-range estimate,
technical specification cards (delivery, base/infrastructure, dimensions), and
related items from other categories. The primary call-to-action is
`בקשת הצעת מחיר` (request a quote), linking to `/contact`. Reuses the shared
`Header` and `Footer`. No cart, checkout, or online payment UI (PRD F5 / AC-4);
the "options" are a visual configurator only, not an ordering flow.

## Selected Figma Frames

Frame inspected via Figma MCP `get_design_context` (fileKey `AUIumATzMjmGOSLtUWbzqG`,
verified this session — screenshot matches the two-column gallery + details layout).

- `Product Detail (RTL Verified)` — node `12:133`
  (https://www.figma.com/design/AUIumATzMjmGOSLtUWbzqG/stones?node-id=12-133)
- Notable sub-nodes within that frame:
  - TopNavBar / Header — `12:337` (brand `אלפר מצבות`, nav with `קטלוג` active, `בקשת ייעוץ`
    CTA, `עברית | EN | RU` switcher) — matches the shared `Header`.
  - Main container (40px side gutters) — `12:134`
  - Breadcrumb (`מצבת גרניט שחורה אבסולוט` › `מצבות גרניט` › `קטלוג מצבות`, RTL) — `12:135`
  - Two-column 12-col grid — `12:146`
    - Side A — Visual gallery (cols 1–7, on the right in RTL) — `12:215`
      - Main product image with a zoom/expand button overlay — `12:216`
      - Thumbnail strip of 4 gallery images (3 dimmed `opacity-60`, 1 active) — `12:222`
    - Side B — Product details & options (cols 8–12, on the left in RTL) — `12:147`
      - `h1` `מצבת גרניט שחורה אבסולוט` (32px) + description paragraph — `12:148`
      - `קטגוריית אבן` — 4 category chips: `מיוחדות` / `גרניט` (active dark) / `אבן חברון` /
        `שיש טורקי` — `12:154`
      - `עיטור וסמלים` — 4 symbol buttons (icon + label): `ללא סמל` / `ענף זית` / `ספר פתוח` /
        `מגן דוד` (active dark) — `12:170`
      - `נוסח הכיתוב (תצוגה מקדימה)` — engraving textarea placeholder
        (`הקלידו כאן את הכיתוב המבוקש...`) + dark preview box (`פ"נ` / `[שם המנוח]` /
        `נלב"ע ביום...`) — `12:186`
      - Price & Action block (top border) — `12:195`
        - note `*המחיר הסופי ייקבע לאחר בחירת כלל המרכיבים` — `12:197`
        - `הערכת מחיר בסיסית` + range `₪8,400 - ₪12,500` — `12:200`
        - icon (save) button + primary `בקשת הצעת מחיר` button — `12:204`
        - reassurance line `ליווי אישי ורגיש לאורך כל התהליך...` with icon — `12:210`
  - Technical Details Section `פרטים טכניים ומפרט` — 3 cards — `12:231`
    - `זמני אספקה והתקנה` (4-item list) — `12:235`
    - `תשתית ובסיס` (4-item list) — `12:249`
    - `מידות המצבה` (4-item list: `גובה כולל: 80 ס"מ`, `רוחב: 60 ס"מ`, `עובי האבן: 10-12 ס"מ`,
      custom) — `12:263`
  - Aesthetic divider (gold `#725b27` line) — `12:277`
  - Related section `אפשרויות הנצחה מקטגוריות נוספות` + `לכל הקטלוג` link + 4 related cards
    (image, title, category subtitle) — `12:278`
  - Footer — `12:313` (matches the shared `Footer`).

## Scope

- In scope:
  - New Product Detail route (per Open Q1 — recommended `frontend/src/app/product/[slug]/page.tsx`
    plus `page.module.css`) rendering the full layout for a single seeded product.
  - Product data seed (one product matching Figma: `מצבת גרניט שחורה אבסולוט`) as a
    module-level constant under `frontend/src/data/` (or colocated), with fields covering PRD
    F2: name, description, photos (placeholder), category + category options, symbol options,
    engraving preview lines, price range, and technical spec groups.
  - New presentational components under `frontend/src/components/`:
    - `ProductGallery` — main image + zoom-button overlay + 4-thumbnail strip (visual-only;
      active/dimmed states as in Figma).
    - `ProductOptions` — `קטגוריית אבן` chips, `עיטור וסמלים` symbol buttons, and
      `נוסח הכיתוב` engraving textarea + dark preview box. Visual-only per Open Q2.
    - `ProductPricing` — note, `הערכת מחיר בסיסית` label, price range, save-icon button +
      primary `בקשת הצעת מחיר` button (→ `/contact`), reassurance line.
    - `TechnicalDetails` — section heading + 3 spec cards, each = icon, `h4`, 4-item list.
    - `RelatedProducts` — section heading + `לכל הקטלוג` link (→ `/catalog`) + 4 related cards
      (placeholder image, title, category subtitle), each linking to its product/category.
  - Extend the existing `Breadcrumb` component to accept a configurable trail (per Open Q3)
    so the product page can render `product › category › catalog`, while the catalog page's
    existing 2-level trail keeps working.
  - RTL layout consistent with `dir="rtl"`, `lang="he"` already set in the root layout;
    reuse existing shared `Header` and `Footer` (no forking).
  - Placeholder imagery (gallery, thumbnails, related cards) — same approach as the
    Homepage's `MaterialsGrid` and the Catalog page (neutral placeholder blocks,
    `// TODO: replace with client-provided photography`). Do not download the 7-day Figma
    asset URLs.
  - Unit tests (Vitest + RTL) for `ProductGallery`, `ProductOptions`, `ProductPricing`,
    `TechnicalDetails`, `RelatedProducts`, and the updated `Breadcrumb`; Playwright smoke test
    for the product route (load + breadcrumb + `בקשת הצעת מחיר` → `/contact` + no console errors).
- Out of scope:
  - A working configurator: category/symbol selection, engraving live-preview typing, gallery
    thumbnail switching, save/wishlist, and image zoom/lightbox are **visual-only** for this
    task (mirrors the visual-only filters/language-switcher precedent). Real interactivity is
    deferred until a data source and requirements exist.
  - Any online ordering, cart, checkout, or payment (PRD F5 / AC-4) — never introduced.
  - Contact form / inquiry backend (separate backlog item); CTA only links to `/contact`.
  - Building the per-category gallery page (`/catalog/[slug]` remains the existing stub);
    this task only links toward `/catalog` and (optionally) category slugs.
  - A real catalog/product database — a single hard-coded seed product is sufficient for AC-2
    of this screen; multi-product data is a follow-up.
  - Changes to Homepage, `Header`, or `Footer` beyond what already exists (Catalog already
    linked/active in `Header`).

## Assumptions

- Figma source is frame `12:133` "Product Detail (RTL Verified)"; layout, copy, and tokens
  below are taken directly from it via Figma MCP `get_design_context` (verified this session).
- `frontend/` exists and the Homepage + Catalog page are implemented. Components present under
  `frontend/src/components/`: `Header`, `Footer`, `Hero`, `Philosophy`, `MaterialsGrid`,
  `ProcessSteps`, `Breadcrumb`, `CatalogGrid`, `CatalogFilters`, `Pagination`. Routes present:
  `/`, `/catalog`, `/catalog/[slug]` (stub), `/contact`. This task extends that app. No
  `backend/` needed — static content.
- `frontend/AGENTS.md` warns this Next.js has breaking changes vs. training data; the
  implementer must read `node_modules/next/dist/docs/` before writing route/page code and
  follow existing route patterns (`app/catalog/[slug]/page.tsx` uses
  `params: Promise<{ slug: string }>` + `await params`).
- The catalog cards currently link to `/catalog/<category-slug>`; the "single memorial stone
  design" of PRD Screen 3 is a level below a category. A dedicated product route is therefore
  introduced (Open Q1) rather than overloading the category stub.
- Design tokens observed in the frame (reuse Homepage/Catalog globals where already defined):
  - Page background `#fbf9f4`; panels/cards `#f5f3ee`; thumbnail active `#eae8e3`.
  - Text: heading `#181919` / `#1b1c19`; body/muted `#444748`; accent/link `#725b27`;
    price/large numerals `#181919`; placeholder `#6b7280`; light-on-dark `#fbf9f4` / `#e4e2dd`.
  - Active chip/button fill `#2d2d2d` / `#181919` with border `#181919`; inactive border
    `#c4c7c7`; engraving preview bg `#1b1815`; textarea border `#747878`.
  - Fonts: Figma uses "Liberation Serif" (headings/body), "Liberation Sans" (small labels),
    and "Noto Serif" (price + engraving preview). Approximate with the Homepage's
    `Noto Serif Hebrew` + serif/sans fallbacks — not pixel-matching.
- Placeholder imagery is used; real photography is a follow-up once the client provides it.

## Open Questions

1. **What route should the Product Detail page use?** The catalog cards link to
   `/catalog/<category-slug>` (category galleries — currently a stub), and the Figma breadcrumb
   shows a product nested under a category (`product › category › catalog`).
   *Recommended:* add a dedicated **`/product/[slug]`** route seeded with one product
   (`black-absolute-granite`), keeping it decoupled from the still-unbuilt category-gallery
   stub. The category-gallery page, when built later, will link its items to `/product/<slug>`.
   Alternative considered: `/catalog/[category]/[product]` (nested) — deferred because it forces
   restructuring the existing `/catalog/[slug]` stub now. **Recommend `/product/[slug]`.**
2. **Are the product options interactive (category/symbol selection, engraving typing, gallery
   switching, zoom, save)?** *Recommended:* No — render them **visual-only / non-interactive**
   for this task (chips and buttons show Figma's default active states statically; engraving
   preview shows the placeholder lines; thumbnails show the dimmed/active states; zoom & save
   buttons are inert). This matches the visual-only filters/language-switcher precedent and
   keeps the page a calm informational screen (no ordering flow). Use accessible markup
   (`disabled`/`aria`) so inert controls don't mislead. Live engraving preview is an appealing
   small enhancement but is deferred to keep scope tight. **Recommend visual-only.**
3. **How should the `Breadcrumb` render a 3-level trail?** The existing `Breadcrumb` is
   hard-coded to the catalog's 2-level trail (`קטלוג מצבות` › `בית`).
   *Recommended:* refactor `Breadcrumb` to accept an optional `items` prop (array of
   `{ label, href? }`, current = no href), defaulting to the current catalog trail for
   backward compatibility; the product page passes `product › category (→/catalog/<cat>) ›
   catalog (→/catalog)`. **Recommend the `items` prop refactor.**
4. **Where do the price range and technical specs come from?** *Recommended:* store them on
   the seed product object (price `min`/`max`, spec groups as arrays) so the exact Figma copy
   (`₪8,400 - ₪12,500`, dimensions, delivery, base) renders from data and stays easy to edit,
   with the disclaimer note `*המחיר הסופי ייקבע לאחר בחירת כלל המרכיבים` shown verbatim.
   Reinforces PRD's "approximate price range, not final online pricing." **Recommend data-driven.**
5. **Brand-label consistency:** the shared `Header`/`Footer` render `שיש אלפר`, while this Figma
   frame shows `אלפר מצבות` (same mismatch flagged in the Catalog plan Open Q3).
   *Recommended:* keep the shared `Header`/`Footer` as-is for cross-page consistency; treat the
   Figma label as a non-blocking design nit for the designer. **Recommend leave as-is.**

## Steps

1. Define the seed product data (per Open Q1/Q4) as a module-level constant (e.g.
   `frontend/src/data/products.ts`): `slug` (`black-absolute-granite`), `name`
   (`מצבת גרניט שחורה אבסולוט`), `description`, `photos` (placeholders + thumbnails),
   `category` (`גרניט`) + `categoryOptions` (chips), `symbolOptions` (with active),
   `engravingPreview` lines, `price` (`{ min: 8400, max: 12500 }`) + disclaimer note,
   `specGroups` (delivery / base / dimensions, each with heading + items), and `related`
   (4 items: title, category subtitle, href, image placeholder).
2. Refactor `Breadcrumb` (`frontend/src/components/Breadcrumb/`) to accept an optional `items`
   prop (per Open Q3); keep the catalog default. Update its unit test.
3. Build `ProductGallery` (`frontend/src/components/ProductGallery/`): bordered main image with
   inert zoom-button overlay + 4-thumbnail strip (active/dimmed states). Placeholder imagery
   (`// TODO: replace with client-provided photography`).
4. Build `ProductOptions` (`frontend/src/components/ProductOptions/`): `קטגוריית אבן` chips,
   `עיטור וסמלים` symbol buttons (icon + label), `נוסח הכיתוב` textarea placeholder + dark
   preview box. Visual-only per Open Q2 (accessible inert markup).
5. Build `ProductPricing` (`frontend/src/components/ProductPricing/`): disclaimer note,
   `הערכת מחיר בסיסית` label, price range from data, inert save-icon button + primary
   `בקשת הצעת מחיר` button linking to `/contact`, reassurance line.
6. Build `TechnicalDetails` (`frontend/src/components/TechnicalDetails/`): `פרטים טכניים ומפרט`
   heading + 3 spec cards (icon, `h4`, 4-item list) rendered from `specGroups`.
7. Build `RelatedProducts` (`frontend/src/components/RelatedProducts/`): heading
   `אפשרויות הנצחה מקטגוריות נוספות`, `לכל הקטלוג` link (→ `/catalog`), 4 related cards
   (placeholder image, title, category subtitle) linking to their targets.
8. Create the route `frontend/src/app/product/[slug]/page.tsx` (per Open Q1) composing
   `<Header/> <main>(breadcrumb + two-column gallery/details grid + aesthetic divider +
   TechnicalDetails + RelatedProducts)</main> <Footer/>`, resolving the product from the seed
   by `slug` (following the existing `params: Promise<{ slug }>` + `await params` pattern);
   `notFound()` for unknown slugs. Add `page.module.css` for the RTL two-column layout.
9. Point the catalog category stub's future items and/or the catalog cards toward the product
   route only if trivial; otherwise leave catalog links unchanged (out of scope). Ensure the
   breadcrumb category link resolves (`/catalog/<category>` stub already exists).
10. Confirm no cart/checkout/payment UI is introduced anywhere (PRD F5 / AC-4); options are
    clearly a visual configurator, not an ordering flow.
11. Write unit tests (Vitest + RTL): `ProductGallery` (main image + 4 thumbnails, active state),
    `ProductOptions` (renders category chips, symbol buttons, engraving preview),
    `ProductPricing` (renders price range + CTA link to `/contact` + disclaimer),
    `TechnicalDetails` (renders 3 groups + items), `RelatedProducts` (renders 4 cards + catalog
    link), `Breadcrumb` (renders a passed 3-level trail and the default trail).
12. Write a Playwright smoke test: `/product/black-absolute-granite` loads, Header shows Catalog
    active, breadcrumb shows the 3-level trail, `בקשת הצעת מחיר` links to `/contact`, related
    `לכל הקטלוג` links to `/catalog`, no console errors.
13. Run `npm test` and `npx playwright test`; fix failures before reporting done.

## Validation

- frontend unit: `cd frontend && npx vitest run`
- e2e: `cd frontend && npx playwright test --reporter=list`
- Manual: `cd frontend && npm run dev`, load `/product/black-absolute-granite`; confirm RTL
  two-column gallery + details layout, category chips, symbol buttons, engraving preview,
  price range, 3 technical spec cards, aesthetic divider, and 4 related cards render and
  visually match Figma frame `12:133` (spot-check via screenshot compare). Confirm the
  `בקשת הצעת מחיר` CTA reaches `/contact` and no cart/checkout/payment UI exists (AC-4).

## Risks

- Hebrew serif/sans font fallback may shift text metrics vs. Figma pixel measurements —
  acceptable variance, not pixel-matching. accept
- Placeholder imagery means shipped gallery/related cards won't match Figma stock photos until
  real photography is swapped in. accept
- Visual-only options (chips, symbols, engraving, zoom, save) could read as functional; keep
  affordances clearly inert (disabled state / no interaction) to avoid implying an ordering
  flow that PRD F5 forbids. accept
- New `/product/[slug]` route must not conflict with the existing `/catalog/[slug]` category
  stub or the future category-gallery task — keep the product route self-contained. accept
- `Breadcrumb` refactor could regress the catalog page's trail — covered by keeping a default
  and adding a unit test for both trails. accept
- Header/Footer brand-label mismatch (`שיש אלפר` vs `אלפר מצבות`) left as-is for consistency;
  designer sign-off pending. accept

## Rollout Order

1. Frontend Agent: implement Product Detail route + components + `Breadcrumb` refactor + seed
   data + tests (no backend ticket — page is static).
2. QA Agent: run unit + e2e validation and visual spot-check against frame `12:133`.

## Rollback

- Revert branch `feat/product-detail-page` commits: remove `frontend/src/app/product/`,
  the new `Product*` / `TechnicalDetails` / `RelatedProducts` components, and the seed data;
  restore `Breadcrumb` to its pre-refactor 2-level form.
- Restore backlog checkbox to unchecked and mark this plan `Status: superseded` if replaced by
  a revised plan.
