-- Bootstrap schema for the opening-agreement service. Idempotent.
-- "expired" is derived at read time from expires_at, never stored.

CREATE TABLE IF NOT EXISTS agreement (
  id text PRIMARY KEY,
  token text NOT NULL UNIQUE,
  amount_ils integer NOT NULL CHECK (amount_ils > 0),
  vat_included boolean NOT NULL DEFAULT true,
  client_name text NOT NULL,
  client_phone text NULL,
  job_description text NOT NULL,
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'viewed', 'signed', 'cancelled')),
  expires_at timestamptz NOT NULL,
  viewed_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS signature (
  agreement_id text PRIMARY KEY REFERENCES agreement (id),
  signer_name text NOT NULL,
  signer_id_number text NOT NULL,
  signature_image text NOT NULL,
  signed_at timestamptz NOT NULL DEFAULT now(),
  user_agent text NULL,
  terms_version text NOT NULL,
  terms_text text NOT NULL,
  terms_text_hash text NOT NULL
);

CREATE INDEX IF NOT EXISTS agreement_created_at_idx ON agreement (created_at DESC);
