# Plan: Google Photos gallery import with headstone detection and name blurring

Status: abandoned (built, tested against real photos, then reverted at the user's request — see
closing note; doesn't cleanly fit the draft/active/done/superseded enum since it was neither
completed as scoped nor replaced by another plan, just discontinued)
Owner: Orchestrator
Last updated: 2026-07-28

> **Closing note (2026-07-28):** implemented and tested end-to-end against ~97 real photos across
> several iterations (see the "Implemented" note below). Real-photo testing surfaced a persistent
> reliability problem: the text-region detector (even after prompt revisions and a two-independent-
> pass union — see git history for `frontend/src/lib/gallery/text-region-detector.ts` on this
> branch before removal) intermittently left fully legible engraved Hebrew text unblurred,
> including on the main subject stone, not just background/neighboring stones. Given the content
> (a deceased person's name, or a family's private epitaph) the cost of a single miss is high, and
> automated review couldn't be trusted to reach zero-miss reliability in the time spent. The user
> decided to blur photos manually instead and asked to remove the automated pipeline entirely.
> Reverted 2026-07-28: `frontend/scripts/`, `frontend/src/lib/gallery/`, the `gallery` npm script,
> the `@anthropic-ai/sdk`/`google-auth-library`/`sharp` dependencies, `allowImportingTsExtensions`
> in `frontend/tsconfig.json`, the Gallery env vars in `frontend/.env.example`/`.env.local`, the
> `/.gallery/` entry in `frontend/.gitignore`, the local `frontend/.gallery/` working directory
> (including the Google OAuth refresh token), and the `.doc/architecture.md` section describing the
> tool (a removal entry was added to its Change Log instead of deleting history). Kept: the
> `frontend/.gitignore` `!.env.example` fix (an independent, still-valid fix unrelated to this
> feature) and this plan file itself, as the historical record of what was tried and why it didn't
> work automated. `frontend/public/images/gallery/` was created as a plain folder for the user to
> paste manually curated, manually blurred photos into — no code or external integration involved.
> Optional follow-up not done here (owner's call, out of scope for a revert): revoking the Google
> OAuth app's access at https://myaccount.google.com/permissions and deleting/rotating the
> Anthropic API key, since the local token was deleted but the upstream grants weren't revoked.

> User answered the Open Questions on 2026-07-23, all "Recommended": (1) build as an internal
> curation tool, no public Gallery page in v1; (2) trigger via a local script, not a public API
> route; (3) human review is required before any image is promoted to `frontend/public/images/`,
> no auto-publish; (4) Google Cloud project/OAuth client not yet set up — credentials still need to
> be provisioned before the OAuth step can be tested end-to-end. Q5 (volume/cost bound) and Q6
> (originals never committed) remain adopted as recommended by default. The account is the user's
> father's Google Photos account.
>
> Implemented (2026-07-23): `frontend/scripts/gallery-import.ts` (`auth`/`import` subcommands, a
> local OAuth callback server, Picker-session polling, per-photo download/classify/detect/blur,
> and a `manifest.json` + `kept/` review folder under gitignored `frontend/.gallery/`);
> `frontend/src/lib/gallery/{types,google-photos-auth,google-photos-picker,image-utils,
> stone-classifier,text-region-detector,blur-image}.ts`; `frontend/.env.example` documents
> `GALLERY_GOOGLE_CLIENT_ID`, `GALLERY_GOOGLE_CLIENT_SECRET`, `GALLERY_GOOGLE_REDIRECT_URI`,
> `ANTHROPIC_API_KEY`; new dependencies `google-auth-library`, `sharp`, `@anthropic-ai/sdk`;
> `frontend/.gitignore` gained a `/.gallery/` entry and (pre-existing gap, also fixed) a
> `!.env.example` exception so `.env.example` files are actually tracked by git;
> `frontend/tsconfig.json` gained `allowImportingTsExtensions` (required for Node's native TS
> runner to resolve this script's relative imports); `.doc/architecture.md` documents the tool as
> a local-only external dependency. 26 new unit tests cover blur-region math (including a safety
> margin around detected text), classifier/detector response parsing, and Picker
> session/pagination polling — `npx vitest run` (110/110), `npm run lint`, `npx tsc --noEmit`, and
> `npm run build` all pass. **Not yet done**: no Google Cloud OAuth client or `ANTHROPIC_API_KEY`
> exists yet (owner-provisioned, per Open Question 4), so the `auth`/`import` flow has not been
> exercised end-to-end against real Google/Anthropic APIs, and no photo has been reviewed or
> promoted into `frontend/public/images/`.

## Goal

Let the business owner pull candidate photos from a Google Photos account, automatically keep
only images that show marble/granite memorial stones, detect and blur any engraved names/text on
those stones, and produce a curated set of privacy-safe images that can be added to the site as a
Gallery — without ever exposing an unreviewed photo (or an unblurred name) publicly.

## Scope

- In scope:
  - OAuth2 connection to a single Google account's Google Photos.
  - Fetching candidate photos from that account.
  - Vision-based classification to keep only marble/granite memorial-stone photos.
  - Vision/OCR-based bounding-box detection of engraved text on kept photos.
  - Blurring detected text regions and writing processed images to disk.
  - A review step before anything is published (see Open Question 3 — this is not optional given
    the content).
  - Documenting new environment variables in `frontend/.env.example`.
- Out of scope (unless an open question below is answered otherwise):
  - A new public "Gallery" page/route. `docs/PRD.md` and `.doc/product-definition.md` currently
    scope the site to Homepage, Catalog, Product Detail, and Contact only, explicitly with no user
    accounts/login and static catalog content. Adding a Gallery page is a product-scope change,
    not just an engineering one, and should be a separate, explicit decision.
  - A publicly reachable, unauthenticated API route that anyone can hit to trigger Google/Anthropic
    API spend or pull a private photo library. See Open Question 2.
  - Automatic publishing of blurred images without human sign-off. See Open Question 3.
  - Any multi-user/multi-account support — this is a single-owner admin workflow.

## Assumptions

- The Google account being connected is the user's father's personal Google Photos account (he is
  presumably a co-owner/operator of the business), which the user has been given access to and
  authorization to use for this purpose — not a site visitor's or customer's account. This repo
  has no user-account system and the product definition explicitly excludes one; this stays a
  single-family, single-credential admin workflow.
- `frontend/package.json` currently has no Google API client, no image-processing library
  (`sharp`/`canvas`), and no Anthropic SDK — all three would be new dependencies. Coding
  convention here is to prefer existing packages, but none of the required capabilities exist yet,
  so at least these additions are unavoidable; keep the list minimal.
- `ANTHROPIC_API_KEY` used by this feature (server-side Claude vision calls) is a **separate**,
  project-owned API key with its own billing — not the Claude Code/assistant session credential.
- **Confirmed (2026-07-23):** as of March 31, 2025, Google removed the `photoslibrary.readonly`,
  `photoslibrary.sharing`, and `photoslibrary` scopes; calls relying on them now return
  `403 PERMISSION_DENIED`. Bulk/automated "scan the whole library" access no longer exists for
  third-party apps. The only supported path is the **Google Photos Picker API**, where the account
  owner (here, the father) explicitly opens Google's own picker UI and manually selects individual
  photos/albums each session; the app then receives only those selected items. This means "fetch
  photos from the library" in this plan's Goal must be read as "process a batch the account owner
  manually selected via the picker," not an automated library scan — there is no automated
  alternative. Sources: [Google Photos APIs updates](https://developers.googleblog.com/en/google-photos-picker-api-launch-and-library-api-updates/),
  [developers.google.com/photos/support/updates](https://developers.google.com/photos/support/updates).
- No backend/database exists (`.doc/architecture.md`); this stays a Next.js-only, single-app
  implementation unless an open question below changes that.

## Open Questions

1. **Is a public-facing Gallery page actually wanted, or is this an internal curation tool that
   feeds the existing Catalog/Product photos?**
   _Recommended:_ build this as an owner-only curation workflow first (connect → review → approve
   → the approved images land in `frontend/public/images/`, used like existing product photos).
   Decide on a public Gallery page as a separate, later product decision once curated images exist.

2. **How is this triggered — Next.js API route, or a local script?**
   The task suggested "expose via a Next.js API route or integrate into the existing agent flow."
   _Recommended:_ a locally-run script (like the existing root-level `dev-loop.js`), not a live API
   route. This flow needs a stored OAuth refresh token and spends paid Anthropic/Google API calls;
   an unauthenticated public route would let anyone trigger both a private-photo-library pull and
   API spend. If a route is genuinely required (e.g., to run from a hosted admin surface), it must
   be authenticated — and this repo has no auth system today, which becomes its own sub-project.

3. **What review gate exists before a blurred image is considered "safe" to publish?**
   This pipeline's failure mode is publishing a real name of a deceased person/customer's family
   because OCR/vision missed a region or misjudged a boundary — a direct conflict with the
   product's "respectful and appropriate for a bereavement context" constraint.
   _Recommended:_ nothing gets copied into `frontend/public/images/` automatically. The script
   writes candidates + blurred previews to a local, gitignored working directory; a human opens
   and visually confirms each one before it's manually promoted. No auto-publish step in v1.

4. **Credentials — who provisions them, and do they exist yet?**
   Needed before implementation can proceed:
   - A Google Cloud project with the Photos API/Picker API enabled, an OAuth 2.0 Client ID/Secret
     (Web application type), and an authorized redirect URI.
   - An `ANTHROPIC_API_KEY` for this project (server-side use, vision + OCR calls).
     _Recommended:_ you provision both and provide placeholder names only (never real values) so I
     can wire up `frontend/.env.example`; I should not attempt to create the Google Cloud project or
     Anthropic key myself.

5. **Volume/cost bound.** ~~A full photo library could be thousands of images~~ — moot: per the
   confirmed Assumption above, only the Picker API is available, so every run is inherently a
   bounded, human-selected batch (an album or manual multi-select). No separate cap decision is
   needed beyond "don't select thousands of photos in one picker session."

6. **Where do original (unprocessed) photos live during processing?**
   They will contain unblurred names — real, sensitive data.
   _Recommended:_ never commit originals; process in a gitignored temp/working directory only, and
   delete or leave them local (not in the repo) once the reviewed, blurred output is promoted.

## Steps

_(sequenced for after the Open Questions above are answered and this plan is approved — no code
changes have been made yet)_

1. Record answers to the Open Questions in this plan; update Scope/Assumptions accordingly. Done.
2. ~~Confirm current Google Photos API access model~~ — done (2026-07-23): Picker API only, see
   Assumptions.
3. Provision credentials (father, since it's his Google account, with the user coordinating):
   Google OAuth Client ID/Secret + redirect URI (Picker API enabled on the Cloud project), and an
   Anthropic API key for this project. I document their names/placeholders in
   `frontend/.env.example` — never real values.
4. Add the minimal new dependencies to `frontend/package.json` (Google API client for the Picker
   API + OAuth, `sharp` for blurring, `@anthropic-ai/sdk`).
5. Implement the OAuth2 connect + token storage step (local-only token file, never in the repo).
   The father authenticates once in a browser; the script stores a refresh token locally.
6. Implement the Picker session flow: create a picker session, have the father select photos in
   Google's picker UI, poll until selection is complete, then download the selected items only.
7. Implement classification pass (Claude vision call per image: marble/granite memorial stone
   yes/no) with a bounded concurrency/rate limit.
8. Implement text-region detection (OCR or vision bounding boxes) on kept images.
9. Implement blurring of detected regions with `sharp`, writing output to the local working
   directory from Q6/Q3 (not `frontend/public/`).
10. Human review step (manual per Q3) before any image is copied into `frontend/public/images/`.
11. Update `.doc/architecture.md` with the new external dependencies (Google Photos, Anthropic
    vision) and the owner-only/local-script trust boundary.
12. Add tests for the parts that don't require live credentials (blur-region math, classification
    response parsing, error handling) following `.rule/error-handling-rules.md` and
    `.rule/testing-rules.md`.

## Validation

- To be defined once Steps are approved; expect at minimum: unit tests for the blur/parsing logic
  run without live credentials, and a manual end-to-end run against a small real batch (a handful
  of photos) reviewed by a human before anything is promoted to `frontend/public/images/`.

## Risks

- **Privacy/PII**: engraved names are the deceased's/family's personal data; an automation miss
  here is a real harm, not just a bug — this is why Open Question 3 (human review gate) is not
  optional in v1.
- **Product-scope creep**: this introduces the site's first backend-ish credentialed integration
  and paid external API usage, in a project explicitly scoped as a static, no-backend site.
- **Google API surface risk (confirmed, not just possible)**: bulk library scanning is not
  available; every run requires the father to manually select photos in Google's picker UI. This
  is a hard external constraint, not an implementation choice — the original "fetch photos from
  the library" framing must be understood as "process a manually selected batch."
- **Cost**: vision classification + OCR calls scale with photo count; needs a hard cap.
- **Credential handling**: OAuth refresh tokens and API keys must never be committed or logged,
  per `.rule/error-handling-rules.md`.

## Rollout Order

1. Approve/answer Open Questions in this plan.
2. Provision credentials (owner).
3. Implement as a local script only; no public route, no auto-publish (v1).
4. Run against a small real batch; human review of every kept/blurred image.
5. Only after that: separately decide/plan whether a public Gallery page gets built from the
   approved output.

## Rollback

- This is a local/offline tool in v1 with no public surface, so rollback is simply: stop running
  the script, and do not promote any un-reviewed images. If a public Gallery page is later added
  from this plan's output, its rollback is removing that page/route and its images, independent of
  this pipeline.
