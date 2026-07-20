# Plan: Contact inquiry email delivery

Status: draft
Owner: Orchestrator
Last updated: 2026-07-19

## Goal

Replace the Contact page's development-only log delivery with real server-side email delivery
so a valid contact inquiry reaches the Alper family and the visitor sees success only after the
email provider accepts the message. Preserve the existing Hebrew/RTL form, same-origin
`POST /api/contact` route, stable error response, and no-order/no-payment product boundary.

## Scope

- In scope:
  - Select and configure one approved transactional email provider or SMTP relay.
  - Add a server-only contact inquiry delivery adapter under `frontend/src/lib/` so provider
    code and credentials do not enter the client bundle or the Route Handler's validation logic.
  - Deliver a plain-text internal notification containing the visitor name, phone, preferred
    contact time, message, and `requestId`.
  - Configure recipient, sender, provider credential, and delivery mode through private
    environment variables; document names with safe placeholders in `frontend/.env.example`.
  - Update `frontend/src/app/api/contact/route.ts` to call the adapter after validation and to
    return success only when the provider accepts the email.
  - Map provider configuration/unavailability failures to the repository's stable error shape
    without exposing provider payloads, credentials, or stack traces.
  - Add payload length limits and the approved initial anti-spam control before enabling public
    email delivery.
  - Replace raw contact inquiry logging with structured delivery metadata only: `requestId`,
    operation, outcome, and safe provider message identifier when available.
  - Update `docs/api-contract.yaml` and `.doc/architecture.md` to describe real email delivery,
    failure responses, external dependency ownership, private configuration, and rollback mode.
  - Add unit, route-handler integration, and Playwright coverage for success, validation,
    provider failure, duplicate-submit protection, and development/test delivery behavior.
- Out of scope:
  - Adding an email field to the visitor form or sending an automatic visitor confirmation;
    the approved Figma form collects phone contact details only.
  - Persisting contact inquiries in a database, CRM, spreadsheet, or queue.
  - SMS, WhatsApp, push notifications, or other delivery channels.
  - Changing the Contact page layout, copy, map, Header, Footer, or existing direct contact links.
  - Committing credentials, placing provider keys in `NEXT_PUBLIC_*`, or exposing them in logs,
    browser responses, tests, screenshots, plans, or documentation.
  - Deploying to production, changing DNS, verifying a domain, merging, or committing without
    the separately required approvals.

## Assumptions

- Plan `.plan/006-2026-07-19-contact-page.md` is complete and its UI decisions remain in force.
- `frontend/src/app/api/contact/route.ts` currently performs server validation and returns a
  simulated success after writing the full inquiry to a local server log.
- `frontend/src/components/ContactForm/ContactForm.tsx` already preserves form values on
  failures and displays a safe endpoint error; its successful UI does not depend on the current
  `mode: simulated` value.
- `docs/api-contract.yaml` currently documents `200`, `400`, and `422`; real delivery adds an
  upstream/configuration failure response without changing validation response semantics.
- The current notification recipient is `dovalper16@gmail.com`, but production recipient and
  sender values will be private environment configuration rather than hard-coded delivery data.
- There is no dedicated backend, database, durable queue, or distributed rate-limit store.
- The implementer must re-read the relevant Next.js 16 Route Handler and environment-variable
  documentation under `frontend/node_modules/next/dist/docs/` before implementation.
- Local unit/E2E tests must never send real email; they use an injected fake delivery adapter or
  an explicitly non-production test mode.

## Open Questions

1. **Which provider and authenticated sender should deliver the email?**
   _Recommended:_ use a transactional email provider with a verified business domain and its
   server-side SDK/API. Provide the provider name and a verified `From` address before approval.
   Use an existing SMTP relay only if the business already manages it and can supply app-specific
   credentials. Do not use a personal mailbox password.
2. **Where should notifications be delivered?**
   _Recommended:_ set `CONTACT_INQUIRY_TO=dovalper16@gmail.com` in deployment configuration for
   the first release, but keep it outside source control so it can change without a code release.
3. **Should the visitor receive an automatic confirmation email?**
   _Recommended:_ no. The current form has no visitor email field and the product decision was to
   stay faithful to Figma. Send one internal notification only and contact the visitor by phone.
4. **What delivery modes should exist outside production?**
   _Recommended:_ support `email` and `simulate`. Tests always inject a fake adapter; local
   development may use explicit `simulate`. Production must fail closed unless mode is `email`
   and all private configuration is valid, preventing a false-success deployment.
5. **What initial spam protection is required?**
   _Recommended:_ add an invisible honeypot, strict field length limits, request-body limits,
   and provider/hosting abuse thresholds in this increment. Do not add in-memory IP rate limiting
   because it is unreliable across serverless instances. Add durable per-IP limiting or a CAPTCHA
   as a follow-up if abuse appears or the deployment platform already provides a shared limiter.
6. **Should provider calls be retried automatically?**
   _Recommended:_ retry at most once only when the selected provider supports an idempotency key
   derived from `requestId`; retry transient timeouts/5xx responses, never validation or auth
   failures. Without provider idempotency support, do not retry automatically—return a safe `503`
   and let the visitor retry manually to avoid duplicate emails.
7. **What should happen to the current full-payload server log?**
   _Recommended:_ remove it when email mode is introduced. Log only structured metadata and keep
   contact inquiry personal information inside the provider request and delivered email.

## Steps

1. Record the approved answers above in this plan, especially provider, verified sender,
   recipient, delivery modes, spam control, and retry/idempotency behavior. Keep status `draft`
   until explicit approval.
2. After approval, create branch `feat/contact-inquiry-email-delivery` from the intended base;
   do not reuse `feat/contact-page` after it is merged unless the user explicitly chooses that
   branch strategy.
3. Read the selected provider's official server-side integration, authentication, sender-domain,
   error, timeout, idempotency, and testing documentation. Add only the required production
   dependency to `frontend/package.json` and lockfile.
4. Add `frontend/.env.example` with names and safe placeholders only, expected to include:
   - `CONTACT_INQUIRY_DELIVERY_MODE`
   - `CONTACT_INQUIRY_PROVIDER_API_KEY` or the selected provider's canonical server-only key
   - `CONTACT_INQUIRY_FROM`
   - `CONTACT_INQUIRY_TO`
   Never copy real values into the repository or use a `NEXT_PUBLIC_*` prefix.
5. Add a provider-neutral adapter such as
   `frontend/src/lib/contact-inquiry-delivery.ts` with a narrow input/output contract. Keep email
   formatting and provider translation inside this server-only boundary, and send plain text in
   the first increment to avoid HTML injection and template complexity.
6. Add configuration validation that runs when delivery is requested, not during static page
   rendering. In production, reject simulated or incomplete configuration with a safe
   `CONTACT_DELIVERY_UNAVAILABLE` response and structured server log.
7. Extend `ContactInquiry` and form submission with the approved honeypot field while keeping it
   visually and accessibly hidden from visitors. Add server-side maximum lengths for name,
   phone, preferred time, and message; never rely on client validation alone.
8. Replace the simulated log block in `frontend/src/app/api/contact/route.ts` with the delivery
   adapter. Preserve `400` malformed JSON and `422` semantic validation behavior. Return `200`
   only after provider acceptance; return `503` for unavailable configuration or transient
   provider failure, with `error.code`, safe Hebrew `error.message`, and `requestId`.
9. Implement the approved timeout and retry rule. If supported, pass an idempotency key based on
   `requestId`; otherwise make one provider attempt and avoid ambiguous duplicate delivery.
10. Update `docs/api-contract.yaml`:
    - change the success description and `mode` from simulated to email delivery;
    - document the honeypot as an implementation-only field if it crosses the JSON boundary;
    - add field length constraints; and
    - add the `503 CONTACT_DELIVERY_UNAVAILABLE` response.
11. Update `.doc/architecture.md` with the selected provider as an external dependency, the
    server-only credential boundary, production/test delivery modes, PII logging rule, failure
    path, timeout/idempotency behavior, and a dated change-log entry.
12. Add tests:
    - delivery adapter: formatted recipient/sender/subject/body, accepted delivery, provider
      rejection, timeout, and retry/idempotency behavior selected in Open Q6;
    - Route Handler: malformed JSON, field lengths, honeypot, provider success, provider failure,
      missing/invalid production config, safe response shape, and no raw provider payload;
    - `ContactForm`: preserves values and permits manual retry after `503`, disables duplicate
      submission while pending, and still announces accepted delivery;
    - Playwright: inject fake delivery, submit successfully, exercise failure/retry, verify no
      browser secrets or console errors, and preserve mobile usability.
13. Run the full validation suite, replace agent reports with real results, and require human QA
    approval before marking this plan and backlog item done.

## Validation

- Static checks: `cd frontend && npm run lint`
- Unit/integration: `cd frontend && npx vitest run`
- Production build: `cd frontend && npm run build`
- E2E with fake delivery only: `cd frontend && npx playwright test --reporter=list`
- Configuration audit:
  - no provider credentials in `git diff`, tracked files, browser bundles, responses, or logs;
  - production mode cannot return simulated success;
  - missing/invalid configuration returns a safe `503` with `requestId`.
- Manual staging check after provider/domain setup:
  - submit one uniquely identified contact inquiry;
  - confirm exactly one message arrives at the configured recipient with correct Hebrew content;
  - confirm visitor success appears only after provider acceptance;
  - force a provider/configuration failure and confirm the visitor sees a retryable message while
    their entered values remain intact;
  - confirm no raw contact inquiry or provider credential appears in application logs.

## Risks

- Provider/domain verification may require DNS access and external waiting time; implementation
  can be code-complete before delivery is operational, but production rollout remains blocked.
- A false-success fallback could silently lose inquiries. Production must fail closed and never
  permit `simulate` mode.
- Provider timeouts can produce ambiguous delivery outcomes and duplicate emails. Use provider
  idempotency for the single bounded retry or avoid automatic retry when unavailable.
- Public endpoints attract spam and can consume provider quota. Initial honeypot/length limits are
  only baseline protection; monitor delivery volume and add durable limiting/CAPTCHA if needed.
- Contact inquiries contain personal information. Do not retain raw request payloads in logs and
  review the selected provider's retention/access settings before production.
- A provider SDK or API change can break delivery. Isolate it behind the adapter and cover provider
  translation with tests.
- Local tests accidentally sending real email would create cost/noise. Tests must inject a fake
  adapter and cannot read production credentials.

## Rollout Order

1. Approve provider, sender, recipient, delivery-mode, spam, and retry decisions in this plan.
2. Configure and verify the sender domain outside source control.
3. Implement adapter, Route Handler, form hardening, contract/docs, and tests on the dedicated
   feature branch.
4. Deploy to a non-production environment with real email mode and private credentials.
5. Run one-message staging validation and provider-failure validation.
6. Obtain human QA approval, then commit/merge/deploy through separately approved actions.
7. Monitor provider delivery/rejection volume immediately after production enablement.

## Rollback

- Set the deployment to a disabled/fail-closed delivery mode that returns a safe `503`; do not
  fall back to simulated success in production.
- Revert the email-delivery commit to restore the last known code while keeping production form
  submission blocked until a safe delivery path exists.
- Revoke/rotate the provider credential if exposure is suspected and remove the affected sender
  authorization if required.
- Restore the prior API contract and architecture documentation only when the corresponding code
  is reverted.
- Mark this plan `superseded` if replaced; keep the backlog item open until real staging delivery
  and human QA both pass.
