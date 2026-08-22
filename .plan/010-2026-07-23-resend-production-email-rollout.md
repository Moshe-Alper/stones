# Plan: Resend production email rollout

Status: done
Owner: Orchestrator
Last updated: 2026-08-22

## Goal

Turn the code-complete Resend email delivery adapter (`.plan/007-2026-07-19-contact-inquiry-email-delivery.md`) into a working production feature: a verified sender domain, real credentials, one successful staging send, and human QA sign-off, so the Contact form's `email` mode can be enabled in production instead of `simulate`.

This is almost entirely account/DNS/deployment-configuration work outside the codebase, not new code. `frontend/src/lib/contact-inquiry-delivery.ts` and the Route Handler are already implemented and tested (`.plan/007`).

## Scope

- In scope:
  - Creating/using a Resend account and API key.
  - Verifying a sending domain (or subdomain) with Resend via DNS records.
  - Deciding the final `CONTACT_INQUIRY_FROM` and `CONTACT_INQUIRY_TO` addresses.
  - Adding the four env vars (`CONTACT_INQUIRY_DELIVERY_MODE`, `RESEND_API_KEY`, `CONTACT_INQUIRY_FROM`, `CONTACT_INQUIRY_TO`) to the hosting platform's private configuration (non-production first, then production).
  - One staging test send and one staging forced-failure check.
  - Human QA approval before flipping production to `email` mode.
- Out of scope:
  - Any further code changes to the adapter/Route Handler (already done in `.plan/007`) unless staging surfaces a bug.
  - Visitor confirmation emails, persistence, other channels — still explicitly out of scope per `.plan/007`.

## Assumptions

- `.plan/007` is implemented and merged/committed (it is — see that plan's status note).
- Sending domain confirmed as `alper-marble.co.il` (real mailbox `moshe@alper-marble.co.il` now exists there). Sender will use a subdomain, `mail.alper-marble.co.il`, so Resend's DNS records don't touch the main domain's existing mail (MX) setup.
- Hosting platform is whatever the site deploys to today (confirm — the repo doesn't currently show a deploy target committed; note it in Step 3 below).
- Nobody should ever set `CONTACT_INQUIRY_DELIVERY_MODE=simulate` in the real production environment — the adapter fails closed (`503`) rather than falling back to simulate, so this is a configuration discipline item, not something the code enforces automatically.

## Steps

1. ~~**Create a Resend account** at resend.com and generate a server-side API key scoped to sending.~~ Done (2026-07-31) — account created, API key in hand.
2. ~~**Add and verify a sending domain**~~ Done (2026-07-31) — `inquiries@mail.alper-marble.co.il` verified in Resend.
3. ~~**Confirm the hosting platform**~~ Done (2026-07-31) — **Vercel**.
4. **Decide final addresses** — Done (confirmed 2026-07-31):
   - `CONTACT_INQUIRY_FROM`: `"Alper Marble <inquiries@mail.alper-marble.co.il>"`.
   - `CONTACT_INQUIRY_TO`: `moshe@alper-marble.co.il` (replaces the earlier `dovalper16@gmail.com` placeholder).
5. **Configure a non-production environment first** (staging/preview deployment) — in Vercel: Project → Settings → Environment Variables, add each var scoped to **Preview** only, then trigger a new deployment for it to take effect:
   - `CONTACT_INQUIRY_DELIVERY_MODE=email`
   - `RESEND_API_KEY=<real key>`
   - `CONTACT_INQUIRY_FROM=Alper Marble <inquiries@mail.alper-marble.co.il>`
   - `CONTACT_INQUIRY_TO=moshe@alper-marble.co.il`
6. **Run one staging validation**: submit a uniquely identified contact inquiry through the real staging UI, confirm exactly one email arrives at the configured recipient with correct Hebrew content and the submitted `requestId`.
7. **Run one staging failure check**: temporarily point `RESEND_API_KEY` at an invalid value (or otherwise force a provider/config failure) and confirm the visitor sees the safe retryable Hebrew message with their entered values preserved, and that no credential/provider payload leaks into the response or logs. Restore the valid key afterward.
8. **Human QA approval**: get sign-off from whoever owns the business/product decision (per `.plan/007`'s rollout order) before touching production.
9. **Configure production** with the same four env vars (real credentials, `CONTACT_INQUIRY_DELIVERY_MODE=email`) via the hosting platform's private configuration — never commit these values.
10. **Monitor** Resend's dashboard (delivery/bounce/complaint volume) for the first inquiries after production enablement.

## Validation

- Domain shows "Verified" in the Resend dashboard before Step 5.
- Staging: one test inquiry → exactly one real email received, correct content, no console/log leakage of the API key.
- Staging failure check: safe `503` + Hebrew retry message, form values preserved, no credential leakage.
- Production: first live inquiry confirmed delivered before considering `.plan/007`'s backlog item fully done.

## Risks

- DNS propagation delays can block Step 2 for longer than expected — start this early, it's the long pole.
- If the hosting platform differs between staging and production (e.g. different projects/env scopes), env vars must be set in both places independently — easy to forget the second one.
- Forgetting to revert the intentionally-broken API key from Step 7 before Step 8 would leave staging non-functional; revert immediately after the check.

## Rollback

Set `CONTACT_INQUIRY_DELIVERY_MODE` to anything other than `email` (or remove it) in the affected environment to fail closed (`503`) — never set `simulate` in production. No code rollback needed unless staging reveals a bug in the adapter itself, in which case follow `.plan/007`'s rollback.

## Next action

Done as of 2026-08-22: the Vercel project was created (see `.plan/014-2026-08-22-vercel-deployment.md`), the four env vars were added scoped to Preview, a redeploy picked them up, and a real test inquiry through the Preview URL's Contact form arrived at `moshe@alper-marble.co.il`. The same vars were then added to Production, redeployed, and a second live test confirmed delivery in production too. The fail-closed retry-message behavior (Step 7) was also incidentally observed and confirmed safe before the Preview vars were first picked up. Rollout complete — no further action needed here; `.plan/014` continues with the custom domain step.
