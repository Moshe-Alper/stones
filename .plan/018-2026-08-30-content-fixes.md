# Plan: Content fixes batch — service area, FAQ trim, granite photo, remove restoration, clickable catalog cards

Status: done (implemented 2026-08-30, on branch fix/header-build-error, uncommitted)
Owner: Orchestrator
Last updated: 2026-08-30

## Context

Six unrelated content/UX corrections requested by the owner in one batch. All copy lives in
`frontend/messages/{he,en,ru}.json` (next-intl, added in commit `a3b1952`) — every text change
must be made in **all three** locale files, and the Hebrew is the source of truth for wording.

Confirmed with the owner:

- Item 4 → **add a new FAQ entry** ("what's included in the price", answer: price excludes the
  lettering / כיתוב). Not existing copy — new Q&A.
- Item 3 → source a Visage Blue granite texture image via web search (owner is not supplying a
  file).

## Goals (per item)

1. **Service area** — drop "עין שמר / Ein Shemer / Эйн-Шемер" (already covered by "ישובי אלונה",
   the Alona/Menashe regional-council settlements) and extend the stated reach "up to Haifa /
   עד חיפה".
2. **FAQ trim** — remove the "how long does the headstone process take" question (`q2`), which
   the owner considers redundant.
3. **Homepage materials photo** — the "גרניט פרימיום / Premium granite" sample card currently
   shows a black granite; replace with a Visage Blue granite texture.
4. **FAQ addition** — new entry clarifying what the quoted price includes, explicitly stating
   it does **not** include the lettering/engraving (כיתוב).
5. **Remove headstone restoration entirely** — the `/renovation` page, its components, all nav
   links to it, and the restoration mentions elsewhere (FAQ `q7`, `ProcessSteps` link).
6. **Catalog cards fully clickable** — on `/catalog`, clicking anywhere on a category card
   (not just the "לצפייה בגלריה" text link) navigates to that category.

## Where each thing lives

| Item | Files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `messages/{he,en,ru}.json` → `ServiceArea.summary` + `ServiceArea.towns` (also feeds SEO: `layout.tsx` `metadata.description` via `{areaSummary}` and `LocalBusiness` JSON-LD `areaServed` — no code change, picks up automatically). `ServiceArea.test.tsx` if it asserts town text.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 2    | `messages/{he,en,ru}.json` → `FAQ` namespace (remove `q2Question`/`q2Answer`, renumber `q3..q7` → `q2..q6`). `src/components/FAQ/FAQ.tsx` (`QUESTIONS` array). `src/components/FAQ/FAQ.test.tsx` (line 16 asserts the `q2` text — repoint to a surviving question).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 3    | `src/components/MaterialsGrid/MaterialsGrid.tsx` (`granite` entry: `image`, `width`, `height`). New asset in `frontend/public/images/`. Remove old `frontend/public/images/material-granite.webp` (only referenced here — confirmed via grep). `frontend/public/images/CREDITS.md`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 4    | `messages/{he,en,ru}.json` → `FAQ` namespace (new `q?Question`/`q?Answer`). `src/components/FAQ/FAQ.tsx` (`QUESTIONS` array).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 5    | Delete `src/app/[locale]/renovation/` (`page.tsx`, `page.module.css`). Delete `src/components/RenovationHero/`, `RenovationProblems/`, `RenovationProcess/`, `RenovationGallery/`. Edit `src/components/Header/Header.tsx` (drop `/renovation` nav link), `src/components/Footer/Footer.tsx` (drop `navRenovation` link), `src/components/ProcessSteps/ProcessSteps.tsx` (drop the `allServicesLink` `<Link href="/renovation">`). `messages/{he,en,ru}.json`: remove `Header.navRenovation`, `Footer.navRenovation`, `ProcessSteps.allServicesLink`, `FAQ.q7*` (see item 2 renumber), `RenovationHero`, `RenovationProblems`, `RenovationProcess`, `RenovationGallery`, `RenovationPage` namespaces; soften `FAQ.q5Answer` (drop "…we offer headstone maintenance and restoration services" / "…שירותי תחזוקה ושיפוץ מצבות"). Check `ProcessSteps` CSS module for now-unused `.allServices` rule. |
| 6    | `src/components/CatalogGrid/CatalogGrid.tsx` + `CatalogGrid.module.css` (stretched-link pattern).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

## Detail per item

### 1. Service area

Owner-confirmed direction: name **both** the Menashe and Alona regional-council communities
(don't drop Menashe), and add the reach up to Haifa. Ein Shemer disappears as a named town —
it's inside the Menashe/Alona council area.

- **he**: `summary` → `"פועלים באזור פרדס חנה-כרכור, חדרה וישובי המועצות האזוריות מנשה ואלונה, ועד חיפה"`;
  `towns` → `["פרדס חנה-כרכור", "חדרה", "ישובי מנשה ואלונה", "עד חיפה"]`
- **en**: `summary` → `"We operate across Pardes Hana-Karkur, Hadera, and the Menashe and Alona regional-council communities, and onward up to Haifa"`;
  `towns` → `["Pardes Hana-Karkur", "Hadera", "Menashe & Alona region", "Up to Haifa"]`
- **ru**: `summary` → `"Мы работаем в Пардес-Хана-Каркур, Хадере и посёлках региональных советов Менаше и Алона, а также вплоть до Хайфы"`;
  `towns` → `["Пардес-Хана-Каркур", "Хадера", "Регион Менаше и Алона", "До Хайфы"]`

`FAQ.q1AnswerTemplate` interpolates `{summary}` — re-reads automatically, no edit. JSON-LD
`areaServed` will then list the new town array; that's fine (Haifa genuinely in range per the
owner).

### 2. Remove the "how long" FAQ question

Delete `q2Question` / `q2Answer` (HE: "כמה זמן לוקח תהליך ההזמנה וההצבה של מצבה?"). Renumber
`q3..q7` → `q2..q6` in all three files and in `FAQ.tsx`'s `QUESTIONS` array so keys stay
contiguous. `FAQ.test.tsx:16` currently asserts the deleted text — change it to assert a
surviving question (e.g. "האם אתם מטפלים גם באישורים מול בית העלמין?").

Combined with item 5 (removing old `q7`), the FAQ ends with **5** questions: areas, cemetery
approvals, recommended stone types, warranty, added inscription to existing stone.

### 3. Visage Blue granite photo

- Web-search for a Visage Blue (a.k.a. "Blue in the Night" / "Vizag Blue") granite **slab /
  texture** image. Prefer a CC0 / public-domain / explicitly royalty-free source (Wikimedia
  Commons, Openverse, a texture site with a permissive licence). Do **not** hotlink or lift a
  copyrighted stone-supplier catalog photo.
- Downscale to ~1200px wide, convert to `.webp`, save as
  `frontend/public/images/material-granite-blue.webp`.
- `MaterialsGrid.tsx`: point the `granite` entry `image` at the new file and update
  `width`/`height` to the real dimensions. Title stays "גרניט פרימיום / Premium granite".
- Delete `frontend/public/images/material-granite.webp`.
- Update `frontend/public/images/CREDITS.md` with the new image's source + licence.

### 4. New "what's included in the price" FAQ entry

Append as the last FAQ item (becomes `q6*` after the item-2 renumber). Draft wording — owner
to confirm the actual inclusions list:

- **he** — Q: `"מה כלול במחיר?"`
  A: `"המחיר כולל את האבן, העיצוב, הייצור וההצבה בבית העלמין. הכיתוב (חריטת האותיות) אינו כלול במחיר ומתומחר בנפרד לפי היקף הטקסט."`
- **en** — Q: `"What's included in the price?"`
  A: `"The price covers the stone, the design, production, and installation at the cemetery. The lettering (engraving the inscription) is not included and is quoted separately based on the amount of text."`
- **ru** — Q: `"Что входит в стоимость?"`
  A: `"В стоимость входят камень, дизайн, изготовление и установка на кладбище. Надпись (гравировка букв) в стоимость не входит и рассчитывается отдельно в зависимости от объёма текста."`

Add the `{ q: t("q6Question"), a: t("q6Answer") }` line to `FAQ.tsx`.

### 5. Remove headstone restoration

Route + components:

- `rm -r src/app/[locale]/renovation/`
- `rm -r src/components/{RenovationHero,RenovationProblems,RenovationProcess,RenovationGallery}/`
- `Header.tsx` — remove `{ href: "/renovation", label: t("navRenovation") }` from `NAV_LINKS`.
- `Footer.tsx` — remove `{ label: t("navRenovation"), href: "/renovation" }` from `NAV_LINKS`.
- `ProcessSteps.tsx` — remove the `<Link href="/renovation" className={styles.allServices}>`
  block (and the now-unused `.allServices` / `.top` layout rule if it only existed for it).

Message files (all three) — remove keys:

- `Header.navRenovation`, `Footer.navRenovation`, `ProcessSteps.allServicesLink`
- whole namespaces: `RenovationHero`, `RenovationProblems`, `RenovationProcess`,
  `RenovationGallery`, `RenovationPage`
- `FAQ.q7*` (old restoration-time question — already going via item 2 renumber)
- edit `FAQ.q5Answer` to drop the trailing restoration-services sentence.

Grep sweep afterwards: `grep -rin "renovation\|שיקום\|реставрац\|восстановлен" frontend/src`
must come back clean (docs/`.plan` archives excluded). No e2e specs reference `/renovation`
(checked). No `sitemap.ts`/`robots.ts` in the project.

### 6. Fully clickable catalog cards

In `CatalogGrid.tsx` each `<article className={styles.card}>` contains a single real
navigation `<Link href={/catalog/${slug}}>`. Use the "stretched link" pattern — keeps exactly
one link in the accessibility tree, no nested-anchor / whole-card-`onClick` hacks:

- `.card { position: relative; }`
- `.cardLink::after { content: ""; position: absolute; inset: 0; }` (covers the whole card)
- `.card:hover` visual affordance (elevation / border) + `.card { cursor: pointer; }` optional.
- Make sure the image/badge aren't `position`ed above the `::after` in a way that eats clicks;
  bump `.cardLink` text back above with `position: relative; z-index: 1` if needed.

Scope: `/catalog` grid only (`CatalogGrid`). `MaterialsGrid` on the homepage is a separate
component and was not mentioned — leave it, or mirror the same pattern later if wanted.

## Scope

- In scope: the files in the table above + their `*.test.tsx` where assertions break.
- Out of scope: redesigning the FAQ/catalog components; touching `ContactForm` (it's reused by
  the deleted renovation page — but it's a shared component, only the renovation page's _usage_
  goes); the homepage `MaterialsGrid` click behaviour; any redirect for the retired
  `/renovation` URL (site is < 2 months live, not indexed for it — a 410/404 is fine).

## Assumptions

- "ישובי אלונה" already subsumes Ein Shemer (Alona / Menashe regional council) — owner said so.
- Deleting the `Renovation*` message namespaces is safe because next-intl only resolves keys on
  render and nothing will render them once the route/components are gone; `tsc` + build will
  catch any missed `t("…")` reference.
- The FAQ renumber (`q3→q2` etc.) is cosmetic; acceptable churn for keeping keys contiguous.
  Alternative: leave gaps (`q1,q3,q4,q5,q6`) — uglier, fewer lines changed. Recommend renumber.

## Open questions — resolved

1. **Item 1 wording** — owner: keep the recommended phrasing but name **both** Menashe and
   Alona regional councils ("ישובי המועצות האזוריות מנשה ואלונה"), don't drop Menashe. Applied
   in Detail §1 above.
2. **Item 4 inclusions** — owner: for now the list stays stone + design + production +
   installation; nothing added. Draft wording in Detail §4 stands.
3. **Item 3 image** — owner: a permissively-licensed stand-in Visage Blue texture is fine.

## Steps

1. Message files: item 1 (service area), item 2 (remove `q2`, renumber), item 4 (add price
   Q&A), item 5 (remove renovation keys/namespaces, soften `q5Answer`) — all three locales.
2. `FAQ.tsx` + `FAQ.test.tsx`: sync `QUESTIONS` array to the new key set; fix the assertion.
3. Delete renovation route + 4 components; strip nav links in `Header.tsx`, `Footer.tsx`,
   `ProcessSteps.tsx` (+ dead CSS).
4. Item 3: fetch/convert the granite image, wire into `MaterialsGrid.tsx`, delete old asset,
   update `CREDITS.md`.
5. Item 6: stretched-link CSS in `CatalogGrid.module.css` (+ tiny `.tsx` tweak if z-index
   needed).
6. Grep sweep for `renovation` / `שיקום` residue.
7. Run `npx vitest run`, `npm run lint`, `npx tsc --noEmit`, `npm run build`.
8. Add a `.plan/000-backlog.md` line; update memory (`plan_multi_language` / service-area notes)
   after merge.

## Validation — results (2026-08-30)

- `npx vitest run` → **76 passed / 20 files** (added a "renders the pricing question" FAQ test).
- `npm run lint` → clean. `npx tsc --noEmit` → clean (after a fresh `next build` regenerated
  `.next/types`, which had a stale reference to the deleted `renovation/page`).
- `npm run build` → succeeds; route list no longer contains `/[locale]/renovation`.
- Playwright `e2e/` suite is **pre-existing broken** (unrelated): every spec asserts
  `html[lang="he"]` on `/`, but next-intl negotiates `en` from Chromium's `Accept-Language`
  since the i18n commit `a3b1952`. Verified identical failures on the un-patched tree via
  `git stash`. Left for a separate e2e-vs-i18n fix (see memory `plan_multi_language`).
- Manual check (prod server, `Accept-Language: he`): `/` serves `lang="he"`; homepage
  "גרניט פרימיום" card shows the blue-grey granite; header/footer have no restoration link;
  `ProcessSteps` heading has no dangling link. `/catalog`: `document.elementFromPoint` over a
  card's image / body / centre all resolve to the single `a.cardLink`, and a real click on the
  image region navigates to `/catalog/hebron-marble` — whole card is clickable, one link in
  the a11y tree.

### Original checklist

- Full suite green (vitest, lint, tsc, build).
- `/renovation` returns 404; no nav link to it anywhere in HE/EN/RU; homepage `ProcessSteps`
  has no dangling link.
- Homepage: service-area chips read "…עד חיפה", no "עין שמר"; granite card shows the blue
  texture; FAQ has 6 items (5 original-minus-one + the new price one), no "how long" question,
  no restoration question.
- `/catalog`: clicking any part of a category card (image, body, whitespace) navigates to the
  category; keyboard tab still lands on one link per card; no console nested-anchor warning.
- `view-source` on `/`: JSON-LD `areaServed` reflects the new town list; `<meta name="description">`
  contains the new summary.
- Repeat the homepage/catalog visual check with `?` locale `/en` and `/ru`.

## Risks

- Copy assertions in component tests (`Footer.test.tsx`, `Header.test.tsx`, `ServiceArea.test.tsx`,
  `ProcessSteps.test.tsx` if present) may hardcode removed strings — expect to update assertions.
- Image licensing (item 3) — must land a properly-licensed file, else use a stand-in and flag it.
- Deleting message namespaces in one locale but not another → next-intl "missing message" at
  runtime. Do all three files in the same pass and let `build` verify.

## Rollback

- `git revert` the batch. The only non-text change is deleted files (renovation route/components,
  old granite image) — all recoverable from history. No data/schema involved.
