# Plan: Communicate service area (Pardes Hana-Karkur and vicinity) sitewide

Status: done
Owner: Orchestrator
Last updated: 2026-08-22

## Context

The site currently never states where the business actually installs memorials. The only
hint is the studio address in `frontend/src/data/contact.ts` ("דרך השדה, צמוד לבית העלמין,
פרדס חנה-כרכור"), buried in the Contact page's address card and map. Meanwhile both
`frontend/src/app/layout.tsx` (SEO description) and `Footer.tsx` (brand blurb) use the phrase
"מובילים את תרבות ההנצחה **בישראל**" — wording that reads as nationwide, not local.

The owner does not travel to make memorials in e.g. Tel Aviv or Ashdod — the real service
radius is Pardes Hana-Karkur and the immediately surrounding area: חדרה, עין שמר, ישובי אלונה.
Right now a visitor (or Google) has no way to know that before submitting an inquiry.

Decisions confirmed with the owner:
- **Framing: positive only.** State the area served everywhere; never name cities that are
  out of range. No explicit "we don't serve Tel Aviv/Ashdod" line anywhere, including FAQ.
- **Area list:** פרדס חנה-כרכור, חדרה, עין שמר, ישובי אלונה — with a trailing "וסביבתן" (and
  surrounding areas) so it reads as a region, not a hard whitelist, without having to name
  every settlement individually.

## Goal

A visitor anywhere on the site — homepage, contact page, footer, search result — can tell
within a few seconds that this business serves Pardes Hana-Karkur and its immediate vicinity,
without ever being told what's excluded. Search engines get the same signal via metadata and
structured data, so the site ranks for local intent rather than implying national reach.

## Recommended direction

Single source of truth + four visible touchpoints + one SEO-only touchpoint:

1. **`frontend/src/data/contact.ts`** — add a `SERVICE_AREA` export (region label + town list
   + one-line sentence), reused everywhere instead of hand-copying the phrase per component.
   ```ts
   export const SERVICE_AREA = {
     towns: ["פרדס חנה-כרכור", "חדרה", "עין שמר", "ישובי אלונה"],
     summary: "פועלים באזור פרדס חנה-כרכור, חדרה, עין שמר וישובי אלונה וסביבתן",
   } as const
   ```
2. **Homepage** — new compact `ServiceArea` section between `Hero` and `MaterialsGrid` in
   `frontend/src/app/page.tsx`: one heading, the summary line, and the four towns as a small
   chip/list row. Same visual weight as `TrustHighlights` (icon + short copy pattern already
   used on the Contact page), not a heavy new block.
3. **Contact page** — extend `ContactDetails.tsx` with a fourth card ("אזור שירות") next to
   Address/Phone/Email, using `SERVICE_AREA.summary`. Cheapest, most contextually correct spot
   — it's literally next to the address the area is centered on.
4. **Footer** — replace the generic "מובילים את תרבות ההנצחה בישראל" blurb with copy that
   leads with craftsmanship and names the region, e.g. "מובילים את תרבות ההנצחה באזור פרדס
   חנה-כרכור וסביבתה למעלה מ-50 שנה, עם דגש על איכות, רגישות ועיצוב נצחי." Same edit applied
   to `layout.tsx`'s `metadata.description` (currently identical wording) for consistency
   between on-page copy and what Google shows in search results.
5. **SEO-only, no visual change:** add `LocalBusiness` JSON-LD to `layout.tsx` with
   `areaServed` listing the four towns and the studio address/geo. This is what actually
   changes how Google Maps / local search interpret the business's radius — worth doing even
   though nobody will "see" it, since it's the highest-leverage way to stop far-away search
   traffic before it reaches the contact form.
6. **FAQ** — one new entry, positively framed only (per the confirmed decision): "באילו
   אזורים אתם פעילים?" → "אנו פועלים באזור פרדס חנה-כרכור, חדרה, עין שמר וישובי אלונה
   וסביבתן." No mention of excluded cities.

## Scope

- In scope:
  - `frontend/src/data/contact.ts`: add `SERVICE_AREA` export.
  - New `frontend/src/components/ServiceArea/ServiceArea.tsx` (+ CSS module), rendered from
    `frontend/src/app/page.tsx`.
  - `frontend/src/components/ContactDetails/ContactDetails.tsx`: add the fourth "אזור שירות"
    card using `SERVICE_AREA`.
  - `frontend/src/components/Footer/Footer.tsx`: update `brandBlurb` copy.
  - `frontend/src/app/layout.tsx`: update `metadata.description`; add `LocalBusiness` JSON-LD
    (`<script type="application/ld+json">`) with `areaServed`, `address`, `name`.
  - `frontend/src/components/FAQ/FAQ.tsx`: add one Q&A entry.
  - Matching test updates: `ContactDetails.test.tsx`, `Footer.test.tsx`, `FAQ.test.tsx` (if
    they exist and assert current copy/card count) and a new `ServiceArea.test.tsx`.
  - `.plan/000-backlog.md`: add this plan as a backlog line once merged.
- Out of scope:
  - Any hard gating in `ContactForm`/`app/api/contact/route.ts` that rejects or flags
    inquiries from outside the area — this plan is messaging-only, not enforcement. If the
    owner later wants the contact form itself to ask "where is the cemetery?" and warn when
    it's far away, that's a separate, bigger feature (needs its own plan).
  - Renaming/restructuring existing routes or navigation.
  - The `/renovation` page — same business, same physical constraint, but not mentioned in
    the request; can be added later by reusing `ServiceArea` if wanted.

## Assumptions

- "ישובי אלונה" refers to the Alona Regional Council settlements as a group, not one place —
  fine to keep as a single list item rather than enumerating every settlement (Katzir, Amikam,
  etc.); the owner didn't ask for that level of detail.
- Structured data (`LocalBusiness` JSON-LD) is safe to add with no design review needed — it's
  invisible markup, not rendered UI, so it doesn't need a Figma pass.
- Existing brand line "מובילים את תרבות ההנצחה בישראל למעלה מ-50 שנה" (leadership claim) and
  the new area-served line aren't in tension — a business can have a national-caliber
  reputation for craftsmanship while only installing in one region. The rewritten Footer/SEO
  copy keeps the 50-years/craftsmanship claim and only swaps "בישראל" for the region name.

## Open Questions

1. **Exact geo coordinates for the JSON-LD `address`/`geo` fields** — `contact.ts` has a Maps
   `MAP_PLACE_ID` already; recommend deriving lat/long from that at write time rather than
   guessing, or leaving `geo` out of the JSON-LD if that's not readily available (an address
   string alone is still valid `LocalBusiness` markup).
2. **Should `ServiceArea` render on `/renovation` too?** Flagged as out of scope above;
   recommend revisiting once this ships, low cost to add later since it's a shared component.

## Steps

1. `frontend/src/data/contact.ts`: add `SERVICE_AREA` export.
2. Build `ServiceArea` component (icon-free or reusing `TrustHighlights`' icon pattern —
   whichever is faster; visual polish is a nice-to-have, the copy is what matters) and mount
   it in `frontend/src/app/page.tsx` between `Hero` and `MaterialsGrid`.
3. Add the fourth card to `ContactDetails.tsx`.
4. Update `Footer.tsx` brand blurb and `layout.tsx` metadata description to name the region
   instead of "בישראל".
5. Add `LocalBusiness` JSON-LD script to `layout.tsx`.
6. Add the FAQ entry.
7. Update/add tests for every touched component; run the suite.
8. Add a `.plan/000-backlog.md` line once done.

## Validation

- `npx vitest run`, `npm run lint`, `npx tsc --noEmit`, `npm run build` all pass.
- Manual walkthrough: homepage shows the new section above the fold-ish area, Contact page
  shows the fourth card, footer copy reads correctly in RTL, FAQ entry expands correctly,
  `view-source:` on the built page shows the JSON-LD script with correct `areaServed`.
- Paste the JSON-LD into Google's Rich Results Test to confirm it validates.

## Risks

- Low risk overall — purely additive/copy changes, no route or data-model changes.
- Copy changes to `Footer`/`layout.tsx` touch text that may be asserted verbatim in existing
  tests — expect to update those assertions, not app behavior.

## Rollout Order

1. Confirm this plan (copy wording especially — Hebrew phrasing above is a first draft, not
   final).
2. Implement steps 1–6.
3. Update tests (step 7), run full validation suite.
4. Update backlog (step 8).
5. Merge.

## Rollback

- Revert the touched files (`contact.ts`, new `ServiceArea/`, `ContactDetails.tsx`,
  `Footer.tsx`, `layout.tsx`, `FAQ.tsx`) plus their tests. No data migration involved.
