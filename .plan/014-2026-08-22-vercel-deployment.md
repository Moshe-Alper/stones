# Plan: Vercel deployment (first publish)

Status: draft
Owner: Orchestrator
Last updated: 2026-08-22

## Goal

Get the `frontend/` Next.js app hosted on Vercel for the first time: a linked Vercel project, a working Preview deployment, and — once validated — a Production deployment reachable at a real URL. This is the missing prerequisite that `.plan/010-2026-07-23-resend-production-email-rollout.md` already assumes ("hosting platform is Vercel") but never actually sets up: there is no `.vercel/` directory and no evidence the GitHub repo has been imported into a Vercel project yet.

## Scope

- In scope:
  - Importing `github.com/Moshe-Alper/stones` into a new Vercel project.
  - Correct monorepo configuration (Root Directory = `frontend`, since the Next.js app is a subfolder, not the repo root).
  - First Preview deployment and verification that it renders correctly (homepage, catalog, product detail, contact, FAQ, renovation service pages).
  - Deciding and wiring the Production branch.
  - Adding the custom domain `alper-marble.co.il` (and `www`) once ready to go fully live.
- Out of scope:
  - Setting the Resend env vars and cutting over the contact form to real email delivery — that is entirely `.plan/010`, which resumes once this plan's Preview environment exists.
  - Any code changes. `next.config.ts` already pins the workspace root correctly for this monorepo layout.

## Assumptions

- Repo: `https://github.com/Moshe-Alper/stones.git`, current branch `feat/contact-inquiry-email-delivery`, which is `main` plus 8 additional commits with nothing on `main` that isn't already in this branch (clean fast-forward, no merge conflicts possible).
- The Next.js app lives in `frontend/`, not the repo root — the repo root's `package.json`/`package-lock.json` belong to unrelated `dev-loop` tooling, not the site.
- `CONTACT_INQUIRY_DELIVERY_MODE` unset in an environment fails closed (HTTP 503) per `frontend/src/lib/contact-inquiry-delivery.ts` — so deploying to Vercel before `.plan/010` finishes does **not** silently drop real customer inquiries, it just shows a visible retry error on the Contact form. This makes it safe to deploy now and finish email delivery afterward.

## Decisions

- **Plan tier: Vercel Hobby (free)**, decided 2026-08-22. Hobby's terms formally scope it to non-commercial use, and this is a commercial site, but enforcement risk is low for a small local business. Accepted for now; revisit upgrading to Pro ($20/mo) once the credit-card payment link (mentioned as a later goal) goes live, since real payment activity makes this more clearly a commercial deployment worth being fully compliant for.

## Open Questions

1. **Which Vercel account/team should own this project?** Recommend: whichever Vercel account you already used to get the Resend-related "hosting platform is Vercel" confirmation in `.plan/010` — likely your personal account. Confirm before Step 1.
2. **Merge to `main` first, or point Vercel's Production branch at `feat/contact-inquiry-email-delivery` directly?** Recommend: merge to `main` (Step 5 below) since it's a clean fast-forward with zero risk, then let Vercel's Production track `main` as usual. Keeps Vercel's branch model simple for future PRs.
3. **When to add the custom domain `alper-marble.co.il`?** Recommend: not immediately. Add it only after `.plan/010`'s Resend rollout is validated (its Step 6/7 staging checks pass), so the first time real visitors hit the real domain, the contact form actually works end-to-end instead of returning a 503. Until then, use Vercel's free `*.vercel.app` URL for review/QA.
4. **Who manages DNS for `alper-marble.co.il`?** Needed for Step 8 (pointing the domain at Vercel — typically an `A`/`ALIAS` record on the apex plus a `CNAME` for `www`). Not yet known from anything in this repo; confirm before Step 8.

## Steps

1. **Sign in to Vercel** (vercel.com) with the account from Open Question 1.
2. **Import the GitHub repo**: New Project → Import Git Repository → `Moshe-Alper/stones`. Grant Vercel's GitHub App access if not already installed.
3. **Set Root Directory to `frontend`** in the import screen's project settings (critical — without this Vercel will try to build the repo root and fail, since the root `package.json` has no Next.js app in it).
4. **Verify auto-detected build settings**: Framework Preset "Next.js", Build Command `npm run build`, Install Command default (`npm install`), Output auto-managed. No env vars are required for the build itself to succeed.
5. **Merge `feat/contact-inquiry-email-delivery` into `main`** (fast-forward, per Open Question 2) so Production tracks a branch that has all the current work — catalog fixes, FAQ, renovation page, header/footer cleanup, and the Resend adapter.
6. **First deployment**: importing the repo triggers an initial deployment automatically. Confirm it succeeds and open the generated `*.vercel.app` Preview/Production URL.
7. **Smoke-check the deployed site**: homepage, Catalog + category galleries, Product Detail, Contact page (form should show the safe 503 retry message since delivery mode isn't configured yet — that's expected), FAQ, renovation service page. Check images load (real photography assets are sizeable — confirm no 404s or timeouts).
8. **Add the custom domain** (only once `.plan/010` is validated, per Open Question 3): Project → Settings → Domains → add `alper-marble.co.il` and `www.alper-marble.co.il`, then add the DNS records Vercel shows at whatever registrar/DNS provider is confirmed in Open Question 4. Wait for DNS propagation and Vercel's automatic SSL issuance.
9. **Resume `.plan/010`** from its Step 5 (add the four Resend env vars scoped to Preview first, then Production) now that the Preview/Production environments this plan sets up actually exist in Vercel.

## Validation

- Vercel project exists, linked to `Moshe-Alper/stones`, Root Directory = `frontend`.
- Preview deployment builds successfully and all pages render with no console errors or broken images.
- Contact form on the live deployment returns the safe Hebrew 503 retry message (expected pre-`.plan/010`), not a crash or silent success.
- Custom domain (once added) resolves over HTTPS with a valid Vercel-issued certificate.

## Risks

- Misconfigured Root Directory is the most likely first-deploy failure mode in this repo, since the root also contains a `package.json`/`package-lock.json` that could confuse monorepo auto-detection.
- Adding the custom domain before `.plan/010` finishes would put a broken (503) contact form in front of real visitors on the real domain — mitigated by Open Question 3's recommended sequencing.
- If DNS for `alper-marble.co.il` is managed somewhere with slow propagation or requires coordination with whoever registered the domain, Step 8 can stall — start that conversation early even though the step itself is scheduled last.

## Rollout Order

1. Steps 1–4 (import + configure) — safe, no visitor-facing effect.
2. Step 5 (merge to `main`) — safe, no deploy behavior change (Vercel isn't watching the repo yet at that point in the sequence, or if it already is, this just updates Production to the latest commit).
3. Steps 6–7 (first deploy + smoke check) — visible only at the `*.vercel.app` URL, not the real domain.
4. `.plan/010` runs to completion (separate plan).
5. Step 8 (custom domain) — the only step with real public visibility; deliberately last.

## Rollback

- Before the custom domain is attached (Steps 1–7): delete the Vercel project, or simply stop pushing to the tracked branch — nothing public-facing is affected.
- After the custom domain is attached (Step 8): remove the domain from the Vercel project's Domains settings and revert the DNS records at the registrar to whatever they pointed to before.

## Next action

Steps 1–7 done as of 2026-08-22: project imported under the **Alper-Marble** Vercel team (free Hobby tier, see [Decisions](#decisions)), Root Directory set to `frontend`, first Production deploy hit a Next.js 16 + Turbopack path-doubling build bug from the local-only `outputFileTracingRoot`/`turbopack.root` override (fixed by skipping it when `process.env.VERCEL` is set), `main` fast-forwarded and pushed, build succeeded. `.plan/010`'s Resend rollout was then completed on top of this (Preview validated, Production validated, real email confirmed both places).

Remaining: Step 8, the custom domain (`alper-marble.co.il` + `www`) — now unblocked, since production email delivery is confirmed working. Still need: which Vercel account already answered (Alper-Marble team); still need to confirm who manages DNS for `alper-marble.co.il` before adding the domain (Open Question 4).
