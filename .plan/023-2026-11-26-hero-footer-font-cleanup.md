# 023 — Hero Heading, Hide Factory Section, Footer Cleanup, Hebrew Font

Status: active
Owner: Moshik Alper
Last updated: 2026-11-26

## Goal
Make the homepage plainer and more honest. Replace the hero heading, which sounds too flowery. Hide the factory section until there are enough photos. Remove footer content that is empty or untrue. Choose a Hebrew font that fits the brand better.

## Scope
In scope (`frontend/`):
1. **Hero heading**: replace "מצבות בעבודת יד, לזכר יקיריכם" (`Hero.heading` in `messages/he.json`, plus EN/RU).
2. **Hide "המפעל שלנו בפרדס חנה"**: remove `<OurFactory />` from `src/app/[locale]/page.tsx`. Keep the component, its tests, its messages and `src/data/factory-photos.ts` so it can come back with one line once photos exist.
3. **Footer cleanup** (`src/components/Footer/Footer.tsx`, `Footer` messages in all 3 locales):
   - Remove the "מידע נוסף" column. Its 4 items (privacy, terms, accessibility, blog) are plain text, not links, and none of those pages exist.
   - Remove "מבקרים: 12,482". It is a hard-coded placeholder, not a real count.
   - Remove the "נגישות AA" badge. The site has never been audited against IS 5568 / WCAG AA, and there is no accessibility statement page, so the claim is unverified.
   - Remove the unused message keys (`infoHeading`, `infoPrivacy`, `infoTerms`, `infoAccessibility`, `infoBlog`, `accessibilityBadge`, `visitorsPlaceholder`) from he/en/ru.
4. **Hebrew font**: switch fonts per the answer to Q3 (`src/app/[locale]/layout.tsx`, `src/app/globals.css`). RU keeps Noto Serif/Sans.

Out of scope: writing an accessibility statement page or doing a real accessibility audit (see Q4), adding new factory photos, and any other homepage sections.

## Assumptions
- Work is based on `origin/main` (local `main` is behind and has diverged).
- EN/RU heading translations will be written by Claude to match the chosen Hebrew one, and the owner reviews them.
- Hiding the factory section also drops the only homepage use of the extra factory photos. The hero photo stays.

## Open Questions

**Q1 — New hero heading. Which one?**
Options (all short and factual, no "לזכר יקיריכם"):
- a. **"מצבות משיש ואבן, מאז 1965"**: says what we do and gives the strongest trust signal.
- b. "שיש אלפר — מצבות מאז 1965": business name and year.
- c. "מפעל מצבות בפרדס חנה, מאז 1965": local and makes clear that we produce the stones ourselves.
- d. "מצבות מאבן טבעית, בייצור עצמי": no year, stresses that we make them ourselves.

Recommended: **a** (or **c** if local SEO matters more). The business name already appears in the header, so b repeats it.
Answer (2026-11-26): **a — "מצבות משיש ואבן, מאז 1965"**.

**Q2 — Footer after cleanup: is the remaining content enough?**
After the cleanup the footer has: brand name + blurb, a "ניווט מהיר" column (catalog, stone types, FAQ), and the copyright.
Recommended: **yes, keep it this minimal**. Optionally add a short "צור קשר" column (phone, WhatsApp, address) taken from `src/data/contact.ts`, which makes the footer useful without inventing anything.
Answer (2026-11-26): **minimal**. No contact column.

**Q3 — Hebrew font. Which pairing?**
Current: **Frank Ruhl Libre** (headings, classic newspaper serif) + **Heebo** (body, a common Roboto-like sans).
All options are free Google Fonts with Hebrew support and load through `next/font`:
- a. **Keep Frank Ruhl Libre for headings, switch body to Assistant**: Assistant is lighter and more refined than Heebo and reads well in long text. Smallest change.
- b. **Noto Serif Hebrew (headings) + Assistant (body)**: a calmer, more modern serif with full weights. Respectful without looking old-fashioned.
- c. **Bellefair (headings) + Assistant (body)**: an elegant, thin display serif that looks well suited to memorials. Only one weight (400), so headings can't be bolded.
- d. **Sans only: Rubik or IBM Plex Sans Hebrew throughout**: clean and contemporary, but loses the "engraved stone" feel of a serif.

Recommended: **b**. Before deciding, Claude can publish a one-page side-by-side preview showing the real hero heading and a body paragraph in each pairing.
Answer (2026-11-26): **show a preview first**. Preview published: https://claude.ai/artifact/SqFcS5XKtS6EWd5VzRCGTA. Owner chose **b — Noto Serif Hebrew + Assistant**.

**Q4 — Accessibility statement (follow-up, not in this plan).**
Israeli regulations generally require websites to meet IS 5568 (≈ WCAG AA) and to publish an accessibility statement. There are exemptions for small businesses that I can't confirm for your case. Do you want a separate follow-up plan for a real accessibility check plus a statement page?
Recommended: **yes, as a separate plan (024)**. Until then, show no badge.
Answer (2026-11-26): **discuss later**. Not part of this plan.

## Implementation Notes (2026-11-26)
- Implemented on branch `plan/023-homepage-footer-font` (based on `origin/main`), not committed yet.
- The hero heading `max-width` went from 720px to 840px so the new heading fits on one line on desktop. With `text-wrap: balance` the line broke between "משיש" and "ואבן", so balance was not used.
- The "factory hidden" check is in `e2e/homepage.spec.ts`. There is no vitest test for the page.
- lint, vitest (102 tests) and `next build` pass. Checked visually at 1280/900/768/375px. Russian still uses Noto Serif.

## Steps
1. `messages/he.json`, `en.json`, `ru.json`: update `Hero.heading` per Q1.
2. `src/app/[locale]/page.tsx`: remove the `OurFactory` import and `<OurFactory />`. Add a short comment noting that it is hidden until photos exist (plan 023).
3. `src/components/Footer/Footer.tsx`: remove the `INFO_LINKS` column and the `bottomLeft` block (badge and visitors). Remove now-unused classes from `Footer.module.css`. Add a contact column if Q2 says so.
4. Remove the unused Footer message keys from all 3 locale files.
5. Fonts per Q3: replace the `next/font/google` imports in `layout.tsx`, update `--font-display` / `--font-sans` in `globals.css`, and keep the `html:lang(ru)` override.
6. Tests:
   - `src/components/Hero/Hero.test.tsx` and `e2e/homepage.spec.ts`: update to the new heading text.
   - `src/components/Footer/Footer.test.tsx`: drop the visitors assertion and assert that the info column, badge and visitors text are absent.
   - Add a homepage test asserting that the factory section is not rendered.
7. Update `.doc/architecture.md` only if it lists homepage sections or the footer structure.

## Validation
- `npm run lint`, `npm test` (vitest) and `npm run build` pass in `frontend/`.
- Check manually in `npm run dev` on `/`, `/en`, `/ru`: new heading, no factory section, a footer with no fake data, and the new font on Hebrew pages only. Russian text still renders in Noto.
- Check the hero heading at phone width (375px) for wrapping.
- Note: the Playwright suite is known to be broken by locale negotiation (plan 017), so e2e text is updated but may not run cleanly.

## Risks
- A font change shifts line lengths and heights, so the hero and cards may need small spacing fixes.
- Bellefair (option c) has a single weight, so CSS that uses `font-weight: 700` on headings would fake bold.
- Removing the footer column changes the footer grid, so the remaining column may need re-alignment in RTL.

## Rollout Order
1. Content and footer changes (Steps 1–4, 6) in one commit.
2. Font change (Step 5) in a separate commit, so it can be reverted on its own.
3. Open a PR → Vercel Preview → owner reviews the preview → merge to production.

## Rollback
- Revert the PR, or only the font commit if just the font is disliked.
- To bring the factory section back: re-add `<OurFactory />` in `src/app/[locale]/page.tsx`. Nothing else was deleted.
