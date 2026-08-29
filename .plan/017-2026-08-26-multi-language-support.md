# Plan: Multi-language support (English, Russian)

Status: implemented (pending translation review)
Owner: Moshik
Last updated: 2026-08-26

## Implementation notes (2026-08-26)

All steps implemented: `next-intl` installed, `app/` restructured to `app/[locale]/`,
`middleware.ts` built as `proxy.ts` instead (Next 16 renamed/deprecated the `middleware`
file convention — see `frontend/AGENTS.md`), every component/page migrated to
`useTranslations`/`getTranslations`, `messages/{he,en,ru}.json` populated, the language
switcher shipped in `Header`, and `/renovation` parity shipped now rather than deferred —
it turned out to be the same mechanical pattern as every other page, so holding it back
added more overhead than it saved.

Two decisions made during implementation, not anticipated in the original draft:
- **Preferred-time options decoupled from their labels**: `PREFERRED_TIME_OPTION_IDS`
  (`morning`/`midday`/`afternoon`) are now the `<select>` value and the server-side
  validation whitelist in `route.ts`; the Hebrew label the business owner sees in their
  notification email is looked up via `getPreferredTimeLabelHe()` in `data/contact.ts`.
  Necessary because the old scheme validated against literal Hebrew display strings,
  which breaks the moment a visitor submits the form in English or Russian.
- **API error messages localized via an `x-locale` request header**: `route.ts` lives
  outside `app/[locale]/` (it's not a page), so it has no `params.locale`. `ContactForm`
  reads its own `useLocale()` and sends it as `x-locale`; the route resolves it against
  `routing.locales` (falling back to `he`) and calls `next-intl/server`'s `getTranslations`
  with that explicit locale.

Verified: `tsc --noEmit`, `eslint`, `vitest run` (75/75), `next build` all pass. Manually
verified via `curl` against a running dev server: `/`, `/en`, `/en/catalog/hebron-marble`,
`/ru/contact` render with correct `lang`/`dir`/fonts/copy; JSON-LD `name` swaps
"שיש אלפר" → "Alper Marble" on `en`/`ru`; hreflang alternates appear automatically via
next-intl's `Link` response header (equivalent to `<link rel="alternate">` for SEO
purposes, so no extra per-page metadata code was needed); the language switcher renders
and disables the active locale; `/api/contact` returns validation errors in Hebrew,
English, or Russian depending on `x-locale`, while a valid submission still reaches
`deliverContactInquiry` with a Hebrew `preferredTime` label regardless of visitor locale.

**Still open**: the EN/RU copy in `messages/en.json` and `messages/ru.json` is an AI-drafted
translation per decision #4 above — needs Moshik's review before this is treated as final,
especially for tone (memorial/bereavement context) and the Russian transliteration of town
names in `ServiceArea.towns`.

## Context

The site is Hebrew-only today: `frontend/src/app/layout.tsx` hardcodes `lang="he" dir="rtl"`,
every string is written directly in JSX/TSX or in data files (`categories.ts`, `contact.ts`,
`gallery.ts`), and there is no i18n library in `package.json`. Next.js is on the App Router
(v16), which has no built-in i18n routing (that was a Pages Router feature) — adding languages
means bringing in a routing + translation library and restructuring `app/`.

Text needing translation is spread across at least: `Header`, `Footer`, `Hero`, `FAQ`,
`Breadcrumb`, `CatalogGrid` (+ `categories.ts`), `CategoryGallery`, `MaterialsGrid`,
`ProcessSteps`, the four page files (`page.tsx` for home/catalog/catalog/[slug]/contact),
`layout.tsx` metadata + JSON-LD, and `data/contact.ts` (address, hours, service-area towns,
preferred-contact-time options). The contact API (`app/api/contact/route.ts`) also returns
Hebrew error strings, though the business notification email it sends
(`lib/contact-inquiry-delivery.ts`) should stay Hebrew regardless of site language — the owner
reads Hebrew, not the visitor's chosen locale.

Decided with the owner: support **English and Russian** alongside Hebrew. Both are LTR, so
this plan doesn't need to solve mixed RTL/LTR non-Hebrew content (unlike Arabic would).

Decisions confirmed with the owner (2026-08-26, all five open questions from the first draft
of this plan resolved by accepting the recommended default in each case):

1. **Address stays in Hebrew on every locale** — only the surrounding labels translate (e.g.
   "Studio address:" vs "כתובת הסטודיו:"). The address itself needs to work with Israeli map
   services regardless of the visitor's reading language.
2. **Cyrillic font**: confirmed via Google Fonts' own subset data
   (`next/dist/compiled/@next/font/dist/google/font-data.json`) that neither `Heebo`
   (`["hebrew","latin","latin-ext","math","symbols"]`) nor `Frank Ruhl Libre`
   (`["hebrew","latin","latin-ext"]`) ships a `cyrillic` subset — Russian text would silently
   fall back to a system font otherwise. Fix: add `Noto Sans` (body) and `Noto Serif`
   (headings) for the `ru` locale — both carry `cyrillic` + `latin` and are a reasonable
   stylistic match for `Heebo`/`Frank Ruhl Libre`. `he` and `en` keep the existing fonts
   unchanged.
3. **Brand name translates**: "שיש אלפר" → "Alper Marble" on `en`/`ru` (metadata, JSON-LD
   `name`, `Header`/`Footer` branding); stays "שיש אלפר" on `he`.
4. **Translation drafting**: produced as part of implementation (Step 9) rather than treated as
   a separate content-only blocker — draft English/Russian translations get written during
   the implementation pass, then reviewed by Moshik before merge rather than shipped unreviewed.
5. **`/renovation` deferred**: English/Russian ship for the core funnel (home → catalog →
   contact) first; `/renovation` parity is a fast-follow, not a launch blocker.

## Goal

A visitor can view the whole site — home, catalog, catalog detail, contact, renovation — in
Hebrew (default), English, or Russian, with correct `dir`/`lang`, a working language switcher,
and no loss of the site's existing Hebrew SEO (current URLs like `alper-marble.co.il/catalog`
must keep working and stay indexed as Hebrew).

## Recommended direction

**Library: [`next-intl`](https://next-intl.dev/)** — the standard i18n solution for Next.js App
Router (App Router has no built-in i18n routing of its own). It gives locale-aware routing,
`useTranslations`/`getTranslations`, a typed message-file structure, and a `localePrefix`
mode that fits this site's constraint:

- **`localePrefix: "as-needed"`, `defaultLocale: "he"`.** Hebrew stays unprefixed at the
  existing URLs (`/`, `/catalog`, `/catalog/hebron-marble`, `/contact`) — no redirects, no SEO
  loss. English and Russian live at `/en/...` and `/ru/...`.
- Routing requires restructuring `app/` so every route sits under an `app/[locale]/` segment
  (`app/[locale]/page.tsx`, `app/[locale]/catalog/page.tsx`, etc.), plus a `middleware.ts` that
  resolves the locale (from the URL prefix, falling back to `Accept-Language`, falling back to
  `he`) and an `i18n/routing.ts` + `i18n/request.ts` config pair (next-intl's standard files).
- **Message files**: `messages/he.json`, `messages/en.json`, `messages/ru.json`, one key per
  UI string, organized by component/page namespace (e.g. `Header.navCatalog`,
  `Contact.form.nameLabel`). Components switch from inline Hebrew strings to
  `useTranslations("Namespace")`.
- **Structured content** (`categories.ts`, `gallery.ts` captions if any, `contact.ts`'s
  `SERVICE_AREA.towns`/`PREFERRED_TIME_OPTIONS`/address/hours) can't just move into flat
  message keys tied to component namespaces — keep the data files as the source of stable IDs
  (slugs, category ids) and put their _translatable text_ into message namespaces keyed by
  that id (e.g. `Categories.hebron-marble.title`), read via `useTranslations` at render time
  instead of importing the Hebrew string directly from the data file.
- **Fonts**: current fonts are `Frank_Ruhl_Libre` and `Heebo` (`next/font/google`), both loaded
  with `subsets: ["hebrew", "latin"]` — neither ships a `cyrillic` subset (confirmed against
  Next's own Google Fonts metadata). Decision: also load `Noto_Serif` (heading) and `Noto_Sans`
  (body), both with `subsets: ["cyrillic", "latin"]`, applied only when `locale === "ru"`; `he`
  and `en` keep `Frank_Ruhl_Libre`/`Heebo` unchanged.
- **Language switcher**: new small control in `Header`, using next-intl's locale-aware
  `Link`/`usePathname`/`useRouter` wrappers so switching language preserves the current page
  (e.g. switching from `/catalog/hebron-marble` to `/en` goes to `/en/catalog/hebron-marble`,
  not `/en`).
- **SEO**: per-locale `metadata.title`/`description` in each `page.tsx` (via
  `getTranslations` in `generateMetadata`), `hreflang` alternate links (next-intl's
  `alternateLinks` support in the routing config generates these automatically), and localized
  `LocalBusiness` JSON-LD in `layout.tsx` (business name stays "שיש אלפר" for `he` and becomes
  "Alper Marble" for `en`/`ru`, per the decisions above; address string stays Hebrew on every
  locale).

## Scope

- In scope:
  - Install `next-intl`; add `middleware.ts`, `i18n/routing.ts`, `i18n/request.ts`.
  - Restructure `frontend/src/app/` → `frontend/src/app/[locale]/` for every existing route
    (home, catalog, catalog/[slug], contact, renovation, api/contact stays outside `[locale]`
    since it's an API route, not a page).
  - Create `messages/he.json`, `messages/en.json`, `messages/ru.json` and migrate every
    hardcoded string in: `Header`, `Footer`, `Hero`, `FAQ`, `Breadcrumb`, `CatalogGrid`,
    `CategoryGallery`, `MaterialsGrid`, `ProcessSteps`, `ContactForm`, `ContactDetails`,
    `ContactHero`, `RenovationHero`/`RenovationProblems`/`RenovationProcess`/`RenovationGallery`,
    `TrustHighlights`, `ServiceArea`, all four page files, and `layout.tsx` metadata/JSON-LD.
  - Translate structured data text: `categories.ts` (title/description per category),
    `contact.ts` (`SERVICE_AREA.towns`/`summary`, `PREFERRED_TIME_OPTIONS`, `hours`,
    `studioLabel`) — keep IDs/slugs/phone/email/map URLs untouched, translate only display text.
  - Localize `app/api/contact/route.ts`'s user-facing validation error messages (the visitor
    sees these; the owner's notification email stays Hebrew — no change there).
  - `Header` language switcher component.
  - `dir`/`lang` set per-locale in `layout.tsx` (`dir="rtl"` for `he`, `dir="ltr"` for `en`/`ru`).
  - Update every existing test (`Header.test.tsx`, `Footer.test.tsx`, `Hero.test.tsx`,
    `CatalogGrid.test.tsx`, `MaterialsGrid.test.tsx`, `Breadcrumb.test.tsx`,
    `CategoryGallery.test.tsx`, `route.test.ts`, etc.) to render under a test
    `NextIntlClientProvider` with real or stub messages instead of asserting hardcoded Hebrew
    strings that no longer exist inline.
  - Font handling for Cyrillic (see Recommended direction).
- Out of scope (for now):
  - Arabic or any other RTL-alongside-non-Hebrew language — flagged by the owner as not needed
    now; would additionally require handling a _non-Hebrew_ RTL locale, which this plan's
    `dir` logic doesn't need to solve yet.
  - Translating the physical address into an English/Russian street-name transliteration —
    decided to keep it in Hebrew on every locale (see Context decisions above).
  - A CMS or admin UI for managing translations — message files are edited directly in the
    repo, same as all other content on this site today.
  - Machine-translating content automatically at request time — all copy is translated once,
    reviewed, and committed as static message files.
  - `/renovation` page parity is included above, but if it turns out to be large/low-priority,
    it can be deferred to a fast-follow rather than blocking the rest of the site.

## Assumptions

- Content volume is small enough (a handful of pages, no blog/CMS) that hand-translating into
  three message files is the right approach — no translation-management service needed.
- The business phone/email/map query stay identical across locales (an English or
  Russian-speaking visitor still calls the same Israeli number and the map still needs to
  resolve a real Israeli address) — only the _label_ text around them is translated.
- Catalog `slug`s (`hebron-marble`, `turkish-marble`, `granite`, `special`) stay the same
  across all three locales — only visible titles/descriptions translate, not the URL segment.
  Keeps `/en/catalog/hebron-marble` valid and avoids a slug-translation system.
- Russian and English are both LTR, so `layout.tsx` only ever needs two `dir` states
  (`rtl` for `he`, `ltr` otherwise) — no per-locale `dir` table required beyond that.

## Open Questions

None outstanding — the five questions raised in the first draft of this plan were all resolved
by accepting the recommended default in each case (see Context "Decisions confirmed with the
owner" above): address stays Hebrew everywhere, Cyrillic gets `Noto_Serif`/`Noto_Sans` for
`ru`, brand name translates to "Alper Marble" on `en`/`ru`, translation drafts get produced
during implementation and reviewed before merge, and `/renovation` is a fast-follow.

## Steps

1. Install `next-intl`; add `i18n/routing.ts` (locales `["he", "en", "ru"]`, `defaultLocale:
"he"`, `localePrefix: "as-needed"`), `i18n/request.ts`, `middleware.ts` with a matcher
   excluding `/api`, static assets, and `_next`.
2. Wire up `Noto_Serif`/`Noto_Sans` alongside the existing fonts in `layout.tsx`, applied when
   `locale === "ru"`, keyed off the resolved `locale` route param.
3. Restructure `app/` → `app/[locale]/` for all page routes; update `layout.tsx` to read
   `locale` from route params, set `lang`/`dir` accordingly, and wrap children in next-intl's
   provider.
4. Create `messages/he.json` seeded from every current hardcoded string (mechanical extraction,
   no wording changes yet) so Hebrew behavior is unchanged after this step — validates the
   plumbing before any new-language content exists.
5. Migrate each component/page from inline strings to `useTranslations`/`getTranslations`,
   one at a time, keeping `messages/he.json` as the only populated file until the pass is done.
6. Move translatable fields out of `categories.ts`/`contact.ts` inline strings into
   `messages/he.json` under stable ID-keyed namespaces (e.g. `Categories.hebron-marble.*`),
   updating the components that render them.
7. Localize `app/api/contact/route.ts` visitor-facing error strings via next-intl's
   non-React `getTranslations` (server-side, works in Route Handlers too).
8. Build the `Header` language switcher using next-intl's locale-aware navigation APIs.
9. Once Hebrew-only plumbing is verified working end-to-end, produce draft English and Russian
   translations for every key in `messages/he.json` → `messages/en.json`/`messages/ru.json`,
   then have Moshik review them before merge.
10. Add per-locale `generateMetadata` (title/description) and hreflang alternates; set the
    `LocalBusiness` JSON-LD `name` to "Alper Marble" for `en`/`ru`, "שיש אלפר" for `he`.
11. Update every existing test to render under `NextIntlClientProvider` with stub/real
    messages instead of asserting hardcoded Hebrew text; add a test for the language switcher.
12. Manual QA pass in all three locales across every page, both mobile and desktop widths.

## Validation

- `npx vitest run`, `npm run lint`, `npx tsc --noEmit`, `npm run build` all pass.
- Visiting `/`, `/catalog`, `/catalog/hebron-marble`, `/contact` (no prefix) still renders
  Hebrew/RTL exactly as before — confirms `as-needed` prefixing didn't change existing URLs.
- Visiting `/en/...` and `/ru/...` equivalents renders translated, LTR content with correct
  `lang` attribute (`view-source:` check).
- Language switcher round-trips correctly from a deep page (e.g. `/catalog/granite` ↔
  `/en/catalog/granite` ↔ `/ru/catalog/granite`), not just from the homepage.
- Submitting the contact form in `/en` shows English validation errors on bad input, while the
  business still receives the Hebrew notification email unchanged.
- `hreflang` tags present and correct in page `<head>` for all three locales.

## Risks

- **Large mechanical diff**: touches nearly every component and every existing test in the
  frontend. Recommend doing this as its own PR (or stacked PRs per Step above) rather than
  bundled with unrelated feature work, and doing Step 4 (Hebrew-only extraction) as a
  checkpoint before touching English/Russian content, so a regression is easy to bisect.
  Prior work in this repo (e.g. `.plan/016`) shows tests assert copy verbatim — expect to
  rewrite most existing test assertions, not just add new ones.
  - Consider it worth checking whether the codebase has an established process for
    large-refactor plans like this before starting — no such precedent exists yet in `.plan/`,
    so this would be the first of its kind here.
- **SEO risk during the `app/[locale]/` restructure**: a routing mistake (e.g. wrong
  `localePrefix` config) could change or break the currently-indexed Hebrew URLs. Mitigate by
  validating the exact same URLs resolve before/after the restructure (Step 3) _before_ adding
  any new-language content.
- **Translation-review risk**: since drafts are produced during implementation (Step 9) rather
  than sourced from a professional translator upfront, Moshik's review pass before merge is
  load-bearing — don't skip it, especially for the memorial/bereavement tone the PRD calls out
  as important.

## Rollout Order

1. Implement Steps 1–7 (infra + Hebrew-only extraction) as one reviewable checkpoint; merge and
   verify existing Hebrew site is unaffected before adding new-language content.
2. Implement Steps 8–12 (switcher, translated content, SEO, tests) once step 1's checkpoint is
   confirmed stable.
3. Ship `/en`/`/ru` for the core funnel (home → catalog → contact) first; treat `/renovation`
   parity as a fast-follow per the decision above, not a blocker for this launch.

## Rollback

- Steps 1–7 are additive/structural but reversible via `git revert` before any new-language
  content is merged — the `app/[locale]/` restructure is the only step with meaningful blast
  radius, and it's isolated to its own commit(s) per the Rollout Order above.
- Once English/Russian content ships, rollback is still a straight revert since no data
  migration or external service is involved — this is a frontend-only, static-content change.
