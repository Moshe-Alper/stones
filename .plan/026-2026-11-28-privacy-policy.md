# 026 — Privacy Policy Page (מדיניות פרטיות)

Status: done
Owner: Moshik Alper
Last updated: 2026-11-28

## Goal
Publish a short, plain-language privacy policy page in he/en/ru. Link it from the footer and from a one-line notice under the contact form's submit button. This meets the duty to inform people when we ask for their personal details (Privacy Protection Law, section 11, made stricter by Amendment 13 from August 2025). This is not legal advice. See Q4 about a lawyer review.

## Background (what the site actually collects, checked 2026-11-28)
- **Contact form** (`frontend/src/components/ContactForm/ContactForm.tsx`) collects:
  - name, phone, preferred call time and a free-text message
  - a hidden `website` honeypot field, used for spam only
- **Where the inquiry goes**: `frontend/src/app/api/contact/route.ts` sends it by email through **Resend** to the business inbox.
  - It is not stored in a database.
  - Server logs hold only `requestId`, the outcome and the provider message ID, never the inquiry's content (covered by tests in `route.test.ts` and `contact-inquiry-delivery.test.ts`).
- **Google Maps iframe** on the contact page (`frontend/src/components/ContactMap/ContactMap.tsx`). Google may set cookies and collect visitor data under its own policy.
- **WhatsApp / Waze / phone links** open third-party apps. The site passes no data to them beyond what the visitor sends.
- **Hosting**: **Vercel** keeps standard request logs (IP address, user agent).
- **No analytics, no ad pixels, no cookies of our own.** next-intl does not use a locale cookie here (`localeDetection: false`).

## Scope
In scope (`frontend/`, all 3 locales):
1. A new page `/[locale]/privacy` with messages `PrivacyPage` (he/en/ru). It uses the same layout and style as the accessibility statement page. Sections:
   - who we are: the business name, address and contact
   - what we collect: the contact form fields, and technical logs at the hosting provider
   - why: only to reply to the inquiry and give a quote, with no marketing and no selling
   - who processes it: Resend (email delivery), Vercel (hosting), and Google (map embed, under Google's own policy)
   - how long it is kept: inquiry emails are kept in the business mailbox for as long as needed to handle the order (see Q2)
   - cookies: the site sets none of its own; only the Google map may set cookies
   - your rights: to see, correct or delete your details, through the privacy contact (phone and email)
   - the last updated date
2. **Form notice**: one short line under the submit button in `ContactForm`, for example: "הפרטים ישמשו רק לחזרה אליכם. [מדיניות פרטיות]". No checkbox (see Q3).
3. **Footer link** `Footer.navPrivacy`, next to the accessibility statement link.
4. **Tests**:
   - vitest for the footer link and the form notice link
   - the page added to the axe e2e spec (`e2e/accessibility.spec.ts`) in he/en/ru
5. **Docs**: add the new route to `.doc/architecture.md`, and add "מדיניות פרטיות" to `.doc/glossary.md` if needed.

Out of scope:
- a cookie consent banner. It isn't needed while there are no analytics or pixels. Revisit if Google Analytics, Meta Pixel or similar is added.
- terms of use (תקנון) and payment terms. These belong with plan 015 (payment link), if it moves forward.
- registering a database with the Privacy Protection Authority. It isn't relevant because nothing is stored in a database.
- a click-to-load map that loads Google only after consent (see Q5).

## Assumptions
- Inquiry emails stay in the business Gmail/Resend inbox, and there is no CRM or spreadsheet export. If there is one, it goes in the policy.
- The privacy contact person is the same as the accessibility contact: משה אלפר, 050-5282431, moshe@alper-marble.co.il.
- Claude writes the EN/RU text, and Moshik reviews the Hebrew text and the translations.

## Open Questions

**Q1 — Business identity on the page.** Show only "אלפר שיש" with the address, or also the legal name and the dealer number (ע.מ.)?
Recommended: **the trade name, address, phone and email. No dealer number.** The law does not require it on this page.
Answer (2026-11-28): approved as recommended. The page shows the trade name "שיש אלפר" (the actual brand spelling), the address, phone and email.

**Q2 — Retention period.** How long do you keep inquiry emails?
Recommended: **write "as long as needed to handle the inquiry and the order, and then deleted on request"** rather than promising a fixed number of days that is hard to keep.
Answer (2026-11-28): approved as recommended.

**Q3 — Consent checkbox on the form.** Add a required "I agree to the privacy policy" checkbox, or only the notice line with a link?
Recommended: **the notice line only.** The data is used only to answer the person's own request, so informing them is enough. A checkbox adds friction to the main lead form.
Answer (2026-11-28): approved as recommended: the notice line only, no checkbox.

**Q4 — Lawyer review.** Have a lawyer look at the Hebrew text before publishing?
Recommended: **publish our version now, and have a lawyer glance at it when convenient.** A clear, honest policy is better than none.
Answer (2026-11-28): approved as recommended: publish now, lawyer review later.

**Q5 — Google Maps loading.** Keep the map loading automatically, or show it only after the visitor clicks "show map"? Click-to-show means Google gets no data from visitors who don't use the map.
Recommended: **keep it as is for now and mention it in the policy.** This is a small site without analytics, and the map helps people find the factory.
Answer (2026-11-28): approved as recommended: keep the map, disclose it in the policy.

## Steps
1. Create branch `plan/026-privacy-policy` from `origin/main`.
2. Add the `PrivacyPage` messages (he first, then en/ru) and the page `src/app/[locale]/privacy/page.tsx`, with metadata and `<main id="main-content">`.
3. Add the footer link and the notice line in the contact form, with their messages in all locales.
4. Add tests: vitest, and the privacy page in the axe e2e spec.
5. Update the docs.
6. Moshik reviews the text, then a PR, a check on the Vercel preview, and a merge.

## Validation
- lint, tsc, vitest and `next build` pass.
- The axe spec has no violations on `/privacy`, `/en/privacy` and `/ru/privacy`.
- The footer link and the form link work in all locales. The form still submits normally, and the notice is inside the form, so screen readers read it before the button.
- The page renders without horizontal scroll at 320px.
- The policy text matches what the code actually does. Re-check the Background section against the code before merging.

## Risks
- The policy can drift from the code. For example, adding analytics later without updating the page. Mitigation: add a line in `.doc/architecture.md` saying that any new third-party script or data collection must update the privacy page.
- The translations may be legally imprecise. Hebrew is the authoritative version, and the EN/RU pages say so.

## Rollout Order
Page, then the footer link, then the form notice, all in one PR. The page is self-contained, so the order inside the PR doesn't matter much.

## Rollback
Revert the PR. It only adds a page, a footer link, one line in the form and messages.

## Implementation Notes (2026-11-28)
Branch `plan/026-privacy-policy`, merged via PR #15 (c2f083f) on 2026-11-28. Live at /privacy.

**Changes**
- New page `frontend/src/app/[locale]/privacy/` (`page.tsx`, `page.module.css`) with messages `PrivacyPage` in he/en/ru. EN/RU show a note that the Hebrew version is binding (`translationNote`, empty in he). The address keeps `lang="he" dir="rtl"`.
- `Footer`: link `navPrivacy` to `/privacy`.
- `ContactForm`: notice line `privacyNotice` with a link to `/privacy`, between the submit button and the status message.
- Tests: vitest for the footer link and the form notice. `/privacy` added to `e2e/accessibility.spec.ts`.
- Docs: change log entry in `.doc/architecture.md`. No glossary change (the accessibility statement isn't listed there either).

**Validation run**
- vitest: 115 tests pass. Lint and tsc are clean. `next build` passes and prerenders `/he|en|ru/privacy`.
- Playwright: all 48 tests pass, including axe on `/privacy` in he/en/ru. The run used a fresh server on port 3010, because a stale `next-server` on port 3000 (started 17:19) was serving an old build and made `reuseExistingServer` test old code.

**Still open**
- Moshik reviews the Hebrew text. Claude wrote the EN/RU translations.
- Lawyer review, when convenient (Q4).
