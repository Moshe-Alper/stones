import "server-only"
import type { Agreement } from "@/lib/agreement-repo"
import { formatIls } from "@/lib/terms"

// Best-effort owner notification. A failure here must never undo a completed signature.
export async function notifyOwnerSigned(
  agreement: Agreement,
  signerName: string,
  requestId: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.MAIL_FROM
  const to = process.env.OWNER_EMAIL
  const summary = `${signerName} חתם/ה על התחייבות ${formatIls(agreement.amountIls)} (${agreement.clientName})`

  if (!apiKey || !from || !to) {
    console.info(JSON.stringify({ level: "info", operation: "notify-signed", requestId, mode: "log-only", agreementId: agreement.id }))
    return
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `signed-${agreement.id}`,
      },
      body: JSON.stringify({
        from,
        to,
        subject: `נחתמה התחייבות: ${agreement.clientName}`,
        text: `${summary}\n\nעבודה: ${agreement.jobDescription}`,
      }),
    })
    if (!response.ok) throw new Error(`resend status ${response.status}`)
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown"
    console.error(JSON.stringify({ level: "error", operation: "notify-signed", requestId, reason }))
  }
}
