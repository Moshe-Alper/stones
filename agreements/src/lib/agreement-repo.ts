import "server-only"
import { randomBytes } from "node:crypto"
import { getDb } from "@/lib/db"
import { renderTerms } from "@/lib/terms"
import type { CreateAgreementInput, SignAgreementInput } from "@/lib/validation"

export type AgreementStatus = "created" | "viewed" | "signed" | "cancelled" | "expired"

export type Agreement = {
  id: string
  token: string
  amountIls: number
  vatIncluded: boolean
  clientName: string
  clientPhone: string | null
  jobDescription: string
  status: AgreementStatus
  expiresAt: string
  viewedAt: string | null
  createdAt: string
}

export type SignedRecord = {
  signerName: string
  signerIdNumber: string
  signatureImage: string
  signedAt: string
  termsVersion: string
  termsText: string
}

type AgreementRow = {
  id: string
  token: string
  amount_ils: number
  vat_included: boolean
  client_name: string
  client_phone: string | null
  job_description: string
  status: "created" | "viewed" | "signed" | "cancelled"
  expires_at: Date | string
  viewed_at: Date | string | null
  created_at: Date | string
}

const toIso = (value: Date | string) => new Date(value).toISOString()

export function newToken(): string {
  return randomBytes(16).toString("base64url")
}

export function toAgreement(row: AgreementRow, now: Date = new Date()): Agreement {
  const open = row.status === "created" || row.status === "viewed"
  const expired = open && new Date(row.expires_at).getTime() <= now.getTime()
  return {
    id: row.id,
    token: row.token,
    amountIls: row.amount_ils,
    vatIncluded: row.vat_included,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    jobDescription: row.job_description,
    status: expired ? "expired" : row.status,
    expiresAt: toIso(row.expires_at),
    viewedAt: row.viewed_at ? toIso(row.viewed_at) : null,
    createdAt: toIso(row.created_at),
  }
}

export async function createAgreement(input: CreateAgreementInput): Promise<Agreement> {
  const db = await getDb()
  const expiresAt = new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
  const result = await db.query<AgreementRow>(
    `INSERT INTO agreement
       (id, token, amount_ils, vat_included, client_name, client_phone, job_description, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      crypto.randomUUID(),
      newToken(),
      input.amountIls,
      input.vatIncluded,
      input.clientName,
      input.clientPhone || null,
      input.jobDescription,
      expiresAt.toISOString(),
    ],
  )
  return toAgreement(result.rows[0])
}

export async function listAgreements(): Promise<Agreement[]> {
  const db = await getDb()
  const result = await db.query<AgreementRow>(
    "SELECT * FROM agreement ORDER BY created_at DESC LIMIT 200",
  )
  return result.rows.map((row) => toAgreement(row))
}

export async function getAgreementByToken(token: string): Promise<Agreement | null> {
  const db = await getDb()
  const result = await db.query<AgreementRow>("SELECT * FROM agreement WHERE token = $1", [token])
  return result.rows[0] ? toAgreement(result.rows[0]) : null
}

export async function markViewed(token: string): Promise<void> {
  const db = await getDb()
  await db.query(
    `UPDATE agreement SET status = 'viewed', viewed_at = now()
     WHERE token = $1 AND status = 'created' AND expires_at > now()`,
    [token],
  )
}

export async function cancelAgreement(id: string): Promise<boolean> {
  const db = await getDb()
  const result = await db.query(
    `UPDATE agreement SET status = 'cancelled'
     WHERE id = $1 AND status IN ('created', 'viewed') RETURNING id`,
    [id],
  )
  return result.rows.length > 0
}

export type SignContext = { userAgent: string | null }

// Returns the signed agreement, or null when it is no longer signable
// (unknown token, already signed, cancelled, or expired).
export async function signAgreement(
  token: string,
  input: SignAgreementInput,
  context: SignContext,
): Promise<Agreement | null> {
  const db = await getDb()
  return db.transaction(async (tx) => {
    const updated = await tx.query<AgreementRow>(
      `UPDATE agreement SET status = 'signed'
       WHERE token = $1 AND status IN ('created', 'viewed') AND expires_at > now()
       RETURNING *`,
      [token],
    )
    const row = updated.rows[0]
    if (!row) return null
    const agreement = toAgreement(row)
    const terms = renderTerms({
      amountIls: agreement.amountIls,
      vatIncluded: agreement.vatIncluded,
      jobDescription: agreement.jobDescription,
    })
    await tx.query(
      `INSERT INTO signature
         (agreement_id, signer_name, signer_id_number, signature_image, user_agent,
          terms_version, terms_text, terms_text_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        row.id,
        input.signerName,
        input.signerIdNumber,
        input.signatureImage,
        context.userAgent,
        terms.version,
        terms.text,
        terms.hash,
      ],
    )
    return agreement
  })
}

export async function getSignedRecord(agreementId: string): Promise<SignedRecord | null> {
  const db = await getDb()
  const result = await db.query<{
    signer_name: string
    signer_id_number: string
    signature_image: string
    signed_at: Date | string
    terms_version: string
    terms_text: string
  }>("SELECT * FROM signature WHERE agreement_id = $1", [agreementId])
  const row = result.rows[0]
  if (!row) return null
  return {
    signerName: row.signer_name,
    signerIdNumber: row.signer_id_number,
    signatureImage: row.signature_image,
    signedAt: toIso(row.signed_at),
    termsVersion: row.terms_version,
    termsText: row.terms_text,
  }
}
