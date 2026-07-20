# Plan: Contact map/location experience

Status: done
Owner: Orchestrator
Last updated: 2026-07-20

> QA complete: `destination_place_id=ChIJK_2MvlsOHRURHMf7uFqyo1A` confirmed and wired into
> `mapsUrl` (the embed itself stays on the text-query form — `q=place_id:...&output=embed`
> only works with a paid Maps Embed API key; without one it rendered a blank world map).
> Waze pin placement and app-open behavior verified on a real device against the local dev
> server over LAN.

> User approved this plan on 2026-07-20 with the recommended answer to each Open Question
> below. Open Q4 (exact pin) uses the same address text already used by the pre-existing
> `mapsUrl` link (`רחוב החרש 12 חולון`) as a best-effort default; the business owner should
> still confirm the precise pin/Place ID before production rollout.

## Goal

Replace the Contact page's decorative CSS map illustration with a real, interactive map of
the studio's true location, so a visitor can see where the workshop actually is and get
directions with one tap. Preserve the existing Hebrew/RTL overlay card (studio label, hours,
Google Maps "ניווט" link), the workshop photo placeholder, and the two-column Contact page
layout from `.plan/006-2026-07-19-contact-page.md`.

## Scope

- In scope:
  - Confirm the studio's exact map pin (coordinates or Place ID) for
    `רחוב החרש 12, אזה"ת חולון` with the business owner before implementation.
  - Replace the `mapArtwork`/`mapPin` CSS illustration in
    `frontend/src/components/ContactMap/ContactMap.tsx` with a real embedded map (technology
    decided in Open Q1), sized responsively with a reserved aspect ratio to avoid layout
    shift, `loading="lazy"`, and a descriptive `title`/`aria-label`.
  - Keep the existing `overlay` card (studio label, hours, external "ניווט" Google Maps
    link) layered on top of the real map.
  - Add a secondary Waze navigation link for Israeli visitors (Open Q2).
  - Add a mobile interaction pattern so the embedded map does not trap page scroll on touch
    devices (Open Q3).
  - Add a fallback state (existing address text + both navigate links, no iframe-dependent
    visual) for when the embed fails to load or is blocked.
  - Update `CONTACT_DETAILS` in `frontend/src/data/contact.ts` with the confirmed map
    embed source and the new Waze URL.
  - Update `frontend/src/components/ContactMap/ContactMap.test.tsx` and any Playwright
    contact-page coverage for the new markup, asserting attributes/links rather than real
    map tiles.
  - Update `.doc/architecture.md` to record the new third-party map embed as an external
    dependency, with a dated Change Log entry.
- Out of scope:
  - Changing the workshop photo placeholder (`workshopPlaceholder`) or adding real workshop
    photography — a separate, unrelated visual asset.
  - A custom-built interactive map (e.g., Leaflet/Mapbox with custom tile styling) unless
    Open Q1 is answered in favor of that approach.
  - Multi-location/store-locator support — the business has one fixed studio address.
  - Any backend, geocoding service, or address-autocomplete functionality.
  - Building a cookie-consent banner or broader privacy-consent framework.
  - Changes to `Header`, `Footer`, `ContactForm`, `ContactDetails`, or other Contact page
    sections.

## Assumptions

- `.plan/006-2026-07-19-contact-page.md` is complete; `ContactMap` currently renders a
  decorative CSS gradient illustration with an SVG-style pin, not a real map (confirmed by
  reading `frontend/src/components/ContactMap/ContactMap.tsx`).
- The business has a single fixed physical location; no need for multiple pins or search.
- No mapping API key or billing account currently exists in this project; the chosen
  approach should not require one unless explicitly approved in Open Q1.
- The primary audience is Israel-based visitors, where Waze is a common navigation app used
  alongside Google Maps.
- Per `frontend/AGENTS.md`, the implementer must re-read the relevant Next.js 16 docs under
  `frontend/node_modules/next/dist/docs/` for any change to embed/loading behavior before
  implementation.

## Open Questions

1. **Which map technology should render the real map?**
   _Recommended:_ a Google Maps embed iframe
   (`https://www.google.com/maps?q=<address-or-place-id>&output=embed`). No API key or
   billing is required, it matches the existing external `CONTACT_DETAILS.mapsUrl` link
   already in use, and it needs no new npm dependency. Alternative: Mapbox/Leaflet with a
   static tile provider, which allows a custom brand-colored pin but adds a new dependency
   and typically requires an API token for comparable benefit at this site's scale. do as you recomended
2. **Should a Waze deep link be added alongside the existing Google Maps link?**
   _Recommended:_ yes. Add `wazeUrl` to `CONTACT_DETAILS`
   (e.g., `https://waze.com/ul?q=<address>&navigate=yes`) and render a second small
   "נווט עם Waze" link beside the existing "ניווט" link in the overlay card. yes
3. **How should the map behave on mobile so it doesn't trap page scroll?**
   _Recommended:_ render the iframe with `pointer-events: none` plus a visible
   "הקש למפה אינטראקטיבית" (tap for interactive map) affordance that clears
   `pointer-events: none` on first tap/click — a common pattern for embedded maps. The
   overlay's navigate links stay tappable regardless of this state. do as recomended
4. **What exact address/coordinates should the map center on?**
   _Recommended:_ the business owner confirms the exact Google Maps pin (drop-pin
   coordinates or Place ID) for `רחוב החרש 12, אזה"ת חולון` before implementation, since the
   studio sits in an industrial zone where a plain text search can be ambiguous. the Address: צמוד לבית העלמין, Derech HaSadeh, Pardes Hanna-Karkur

5. **Is a third-party map embed acceptable without a cookie-consent banner?**
   _Recommended:_ yes for this increment. Google Maps embed iframes are commonly used
   without a consent banner on small Israeli business sites, and no visitor-entered personal
   data is sent to the provider. Revisit if the business later needs GDPR-strict handling. do as recomended
6. **Should a fallback exist for a blocked/failed map embed?**
   _Recommended:_ yes — keep a lightweight fallback (address text + both navigate links)
   shown when the iframe fails to load, so the section stays usable if a browser extension
   or network policy blocks the embed. do as recomended

## Steps

1. Record the confirmed address/coordinates, Waze URL, and answers above in this plan; keep
   `Status: draft` until approved.
2. After approval, create branch `feat/contact-map-location-experience` from `main`.
3. Add `mapsEmbedUrl` (and/or `placeId`) and `wazeUrl` to `CONTACT_DETAILS` in
   `frontend/src/data/contact.ts`.
4. Rewrite `frontend/src/components/ContactMap/ContactMap.tsx`: replace the
   `mapArtwork`/`mapPin` CSS illustration with a real `<iframe>` (`src` from
   `CONTACT_DETAILS.mapsEmbedUrl`, descriptive `title`, `loading="lazy"`,
   `referrerPolicy="no-referrer-when-downgrade"`), keep the existing `overlay` card, add the
   Waze link, and implement the tap-to-activate interaction from Open Q3.
5. Update `frontend/src/components/ContactMap/ContactMap.module.css` to replace the
   `.mapArtwork`/`.mapPin` rules with responsive/aspect-ratio sizing for the iframe and the
   tap-to-activate affordance styling.
6. Implement the fallback state for a blocked/failed iframe load.
7. Update `frontend/src/components/ContactMap/ContactMap.test.tsx` to assert the iframe
   `src`/`title`, both navigation links (Google Maps + Waze), and fallback rendering, without
   depending on real network map tile loads.
8. Update any Playwright contact-page spec touching the map region to assert
   presence/attributes rather than visual map content.
9. Update `.doc/architecture.md`'s external-dependencies notes to record the Google Maps
   embed iframe as a new third-party dependency, with a dated Change Log entry.
10. Run the validation suite, replace agent reports with real results, and get human QA
    sign-off — including a real-device mobile check of the scroll/tap behavior — before
    marking this plan and its backlog item done.

## Validation

- Static checks: `cd frontend && npm run lint`
- Unit: `cd frontend && npx vitest run`
- Production build: `cd frontend && npm run build`
- E2E: `cd frontend && npx playwright test --reporter=list`
- Manual check: load the Contact page on desktop and mobile viewports; confirm the map
  centers on the correct studio location, both the Google Maps and Waze links open the
  correct destination, page scroll is not trapped by the map on touch scroll, and the
  fallback renders correctly with the iframe request blocked.

## Risks

- Ambiguous or incorrect geocoding could place the pin at the wrong building in the
  industrial zone; mitigated by confirming the exact pin (Open Q4) before implementation.
- The third-party iframe adds an external network dependency and a minor performance/CLS
  risk if not sized correctly; mitigated by a reserved aspect ratio and `loading="lazy"`.
- Embedded maps can trap scroll/touch input on mobile, degrading UX; mitigated by the
  tap-to-activate pattern (Open Q3).
- Some privacy-focused browsers/extensions block Google-hosted iframes; mitigated by the
  fallback state (Open Q6).
- The Waze URL scheme behaves differently between installed-app and web fallback; verify on
  a real mobile device before sign-off.

## Rollout Order

1. Approve the address/coordinates, map technology, Waze link, mobile-interaction, and
   fallback decisions in this plan.
2. Implement on the dedicated feature branch.
3. Run the full validation suite and manual desktop + mobile QA.
4. Obtain human QA approval, then commit/merge/deploy through separately approved actions.

## Rollback

- Revert the `ContactMap` component/CSS/data changes to restore the previous CSS map
  illustration; there are no server-side or data-persistence changes to unwind.
- Mark this plan `superseded` if a different map technology is chosen later; keep the
  backlog item open until real staging/device QA passes.
