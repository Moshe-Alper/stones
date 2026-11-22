# agreements

Owner-only service: enter an amount, get a link, send it on WhatsApp, the client signs a payment
commitment before the owner opens a memorial stone. See `../.plan/019-2026-11-22-opening-agreement-service.md`.

## Run locally

```
cd agreements
npm install
# copy the example env file to a local one and set OWNER_PASSWORD and SESSION_SECRET
npm run dev     # http://localhost:3100 (also reachable from a phone on the LAN)
npm test
```

- Data lives in `.data/pglite` (embedded Postgres, git-ignored) unless `DATABASE_URL` is set, in which
  case hosted Postgres is used. Schema: `db/schema.sql` (applied idempotently on first connection).

## Deploy (Vercel)

Second Vercel project from the same repo: Root Directory `agreements`, Framework Next.js.
Environment variables (Production and Preview):

| Name | Value |
|---|---|
| `DATABASE_URL` | Postgres connection string (Neon, via Vercel Storage / Marketplace) |
| `OWNER_PASSWORD` | long random password for the owner login |
| `SESSION_SECRET` | random string, 32+ characters |
| `APP_BASE_URL` | public URL, e.g. `https://sign.alper-marble.co.il` |
| `RESEND_API_KEY`, `MAIL_FROM`, `OWNER_EMAIL` | optional, email on signature |
- Terms text: `src/lib/terms.ts`. Changing the wording requires bumping `TERMS_VERSION`.
- Sending the link to a real client requires a public URL (deploy, or a tunnel) and `APP_BASE_URL`.
