# Plan: Replace placeholder images with real (free-license) photography

Status: done
Owner: Orchestrator
Last updated: 2026-07-20

> User approved this plan on 2026-07-20 and picked the recommended candidate for all
> six image slots (see Open Question 3). Implemented: six Pexels photos (free license,
> no attribution required for downloaded use) downloaded, resized, and converted to
> WebP under `frontend/public/images/`, credited in
> `frontend/public/images/CREDITS.md`, and wired into `Hero.tsx`, `MaterialsGrid.tsx`,
> `Philosophy.tsx`, and `ContactMap.tsx` via `next/image` (`fill` for the hero and the
> contact workshop photo, explicit `width`/`height` for the three material swatches and
> the craftsmanship photo). `npm test`, lint, and `npm run build` all pass; verified
> visually via Playwright screenshots at desktop and mobile widths on both the
> homepage and the Contact page — no layout shift, no `placehold.co` references left
> (`grep -r placehold.co frontend/src` returns nothing).

## Goal

Replace the four remaining hotlinked `placehold.co` gray boxes (and one CSS-only
stand-in) with real, dignified, license-clear photography — sourced for free from
Unsplash/Pexels, downloaded, and self-hosted — so the site no longer visibly reads as
a wireframe outside the product catalog. This is explicitly an interim step: it does
not replace the eventual client-provided photography the existing `TODO` comments call
for, it just replaces "gray box with text" with "a real, appropriate photo" in the
meantime.

## Scope

- In scope — the four non-catalog placeholder image slots:
  1. `frontend/src/components/Hero/Hero.tsx` — homepage hero background
     (`placehold.co/1600x900`, "Alper Marble").
  2. `frontend/src/components/MaterialsGrid/MaterialsGrid.tsx` — three material cards
     (`placehold.co/600x600`: Granite, Marble, Basalt).
  3. `frontend/src/components/Philosophy/Philosophy.tsx` — "craftsmanship" image
     (`placehold.co/800x900`).
  4. `frontend/src/components/ContactMap/ContactMap.tsx` — the `workshopPlaceholder`
     block, currently a CSS-only `<div role="img">` with a text label, not an `<img>`
     at all. `.plan/008-...md` explicitly deferred this as "a separate, unrelated
     visual asset" — this plan is that follow-up.
- Also in scope:
  - Downloading and self-hosting the chosen images under
    `frontend/public/images/`, converted to WebP.
  - Swapping plain `<img>` tags for `next/image` in the four touched components
    (low incremental cost since every reference is being edited anyway; fixes missing
    `width`/`height`/lazy-loading on these specific images and removes the external
    hotlink as a load-time dependency).
  - A non-customer-facing `frontend/public/images/CREDITS.md` recording source URL,
    photographer, and license per downloaded file, for future re-licensing/audit
    purposes.
  - Updating the affected component tests
    (`Hero.test.tsx`, `MaterialsGrid.test.tsx`, `Philosophy.test.tsx`, and any
    `ContactMap` test coverage) for the new markup/alt text.
- Out of scope:
  - **Product catalog/gallery photography** (`ProductGallery`, `CatalogGrid`,
    `RelatedProducts`, `src/data/products.ts`) — those are a separate, real-inventory
    concern, not this task.
  - Any new sections, layout changes, or copy changes beyond swapping the image source.
  - Live/dynamic image APIs (Unsplash API, Pexels API) called at request time — see
    Open Question 1 for why this is rejected rather than deferred.
  - Photos depicting an actual grave marker, headstone inscription, or identifiable
    cemetery — see Assumptions.
  - Any customer-visible attribution UI (footer credit line, etc.).

## Assumptions

- The business has no real photography yet to supply — these stock photos are a
  placeholder-for-the-placeholder, not final. The existing `// TODO: replace with
client-provided photography` comments stay in the code (or get reworded to point at
  this plan) so a future pass swaps them again.
- Per `.doc/product-definition.md` ("Content and imagery must remain respectful and
  appropriate for a bereavement context"), none of the four slots should show an actual
  memorial stone with visible inscriptions/names or a recognizable cemetery. All four
  slots are naturally about _material and craft_ (stone texture, carving, workshop
  atmosphere), not finished installations, so this is achievable without strain.
- Repo has no image CDN, asset pipeline, or CMS today — six small self-hosted files
  under `public/` is proportionate; no need to introduce one for this.
- Confirmed current license terms (Unsplash License / Pexels License): downloaded
  images are free for commercial use with **no attribution required**. Attribution
  becomes _mandatory_ only if the images/photos are pulled live through their APIs —
  which is exactly the pattern this plan avoids. (Sources: [Unsplash License](https://unsplash.com/license), [Unsplash API Terms](https://unsplash.com/api-terms), [Pexels License](https://www.pexels.com/license/))

## Open Questions

1. **Self-host downloaded images, or hotlink a free image API/CDN at runtime?**
   Recommended: **self-host**. Hotlinking (e.g. `source.unsplash.com`, a live Pexels
   API call) reintroduces the exact failure mode we're removing —
   an external, rate-limited, occasionally-down dependency for a decorative image —
   and both providers' API Terms require visible attribution UI when images are served
   live, which downloaded/self-hosted use does not. Self-hosting also lets `next/image`
   optimize the files. recomended

2. **Migrate these four `<img>` tags to `next/image` in the same pass?**
   Recommended: **yes**. The files becoming local (no remote domain to allowlist in
   `next.config.ts`) makes this close to free, and it fixes the hero image (today's
   largest, unsized, eagerly-loaded `<img>`) as a likely LCP/CLS contributor. Scope
   stays limited to the four components already being touched — not a site-wide
   `next/image` migration. yes

3. **Exact photo choice per slot.** Recommended workflow: before downloading anything,
   I'll shortlist 2–3 free-license candidates per slot (via Unsplash/Pexels search) and
   share thumbnails/links for a quick pick, rather than the plan pre-committing to
   specific files. Directional targets, all texture/craft/atmosphere rather than a
   finished memorial:
   - Hero: warm, wide stone/marble workshop atmosphere shot (fits current beige
     `#d8d3c4` palette).
   - Materials ×3: close-up granite / marble / basalt slab textures.
   - Philosophy: hands carving/engraving stone (craftsmanship, no visible text/name).
   - ContactMap workshop: stonemason workshop interior (tools, slabs, dust) —
     generic "family workshop" atmosphere, not the real studio (no real photo exists
     yet). ok

4. **Is the `ContactMap` `workshopPlaceholder` in scope**, given `.plan/008` called it
   out as a separate task? Recommended: **yes** — 008 deferred it _because_ it's a
   generic photography task, and this plan is that task. No other `ContactMap` behavior
   changes. yes

5. **Optimization target.** Recommended: convert to WebP, cap at roughly 1600px on the
   long edge for the hero and 900px for the others, and hand-check each file stays
   well under ~250KB before committing, since these are static repo assets, not a
   build-time pipeline. yes

## Steps

1. Shortlist 2–3 candidate free-license photos per slot (Open Question 3) and get a
   quick pick from the user before downloading anything.
2. Download the approved picks, convert to WebP, resize per Open Question 5, and save
   under `frontend/public/images/` with descriptive names (e.g. `hero-workshop.webp`,
   `material-granite.webp`, `material-marble.webp`, `material-basalt.webp`,
   `craftsmanship-carving.webp`, `contact-workshop.webp`).
3. Add `frontend/public/images/CREDITS.md` — source URL, photographer, and license per
   file (internal reference, not rendered in the UI).
4. `Hero.tsx` / `Hero.module.css`: replace the `placehold.co` `<img>` with `next/image`
   pointed at `hero-workshop.webp`; keep the existing `.gradient` overlay and
   `.imageLayer` positioning; drop or reword the `TODO` comment.
5. `MaterialsGrid.tsx` / `.module.css`: replace the three `placehold.co` URLs in the
   `MATERIALS` array with the three local WebP files via `next/image`.
6. `Philosophy.tsx` / `.module.css`: replace the `placehold.co` `<img>` with
   `next/image` pointed at `craftsmanship-carving.webp`; keep the existing
   `alt="אומן חורת מצבה"`.
7. `ContactMap.tsx` / `.module.css`: replace the CSS-only `workshopPlaceholder`
   `<div role="img">` with a real `next/image` inside the same styled container,
   sized/cropped to the existing layout slot; keep an appropriate `alt` (the text label
   "בית המלאכה המשפחתי" can move to a caption or stay as `alt`).
8. Update `Hero.test.tsx`, `MaterialsGrid.test.tsx`, `Philosophy.test.tsx`, and any
   `ContactMap` test coverage for the new image markup/alt text; add/adjust assertions
   that no `placehold.co` reference remains.
9. Run `npm test`, lint, and `npm run build` in `frontend/`; visually check the
   homepage and contact page in the dev server (desktop + mobile widths) for layout
   shift or cropping issues.
10. `grep -r "placehold.co" frontend/src` to confirm zero remaining references.

## Validation

- `grep -r "placehold.co" frontend/src` returns nothing.
- `npm test` and `npm run build` pass in `frontend/`.
- Manual check in the dev server: Homepage hero, Materials grid, Philosophy section,
  and Contact page workshop visual all render real photos with no layout shift,
  correct cropping at desktop and mobile widths, and no visible attribution UI.
- All new/edited `<Image>` elements have non-empty, descriptive `alt` text (or
  `alt=""` only where the surrounding text already conveys the meaning, as today's
  `Hero.tsx` does).
- Each downloaded file is logged in `frontend/public/images/CREDITS.md`.

## Risks

- **Tone mismatch** — a generic stock photo can undercut the "family business" feel
  the brand relies on. Mitigated by the candidate-approval step in Open Question 3
  before any file is downloaded.
- **Bereavement-context sensitivity** — must avoid any photo showing a real,
  identifiable grave marker/inscription or cemetery (see Assumptions); sticking to
  texture/craft/workshop imagery avoids this by construction.
- **These are still not final** — a future task will swap them again for real
  client photography; keep that expectation visible in code (TODO comment / this
  plan's reference) so it isn't mistaken for "done."
- **License terms could change per-photo** (a specific Unsplash/Pexels upload gets
  taken down or re-licensed) — mitigated by self-hosting the actual bytes rather than
  hotlinking, and by keeping `CREDITS.md` so a swap is traceable if ever needed.

## Rollout Order

Single branch/PR covering all four slots together — small, purely visual, no backend
or data dependency between the four components, so there's no benefit to splitting it
into a smaller rollout sequence.

## Rollback

Revert the commit. All changes are static local image files plus the four component
edits; no data migration, no external state, nothing else depends on these files.
