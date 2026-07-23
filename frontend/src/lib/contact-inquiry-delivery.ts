import "server-only"
import { Resend } from "resend"

export type ContactInquiryDeliveryInput = {
  requestId: string
  name: string
  phone: string
  preferredTime: string
  message: string
}

export type ContactInquiryDeliveryOutcome =
  | { outcome: "delivered"; mode: "email"; providerMessageId: string }
  | { outcome: "delivered"; mode: "simulate" }
  | {
      outcome: "unavailable"
      mode: "email" | "unset"
      reason: "missing_configuration" | "provider_error" | "timeout"
    }

const SEND_TIMEOUT_MS = 8000

function formatBody(input: ContactInquiryDeliveryInput): string {
  return [
    `שם: ${input.name}`,
    `טלפון: ${input.phone}`,
    `זמן מועדף ליצירת קשר: ${input.preferredTime}`,
    "",
    "הודעה:",
    input.message,
    "",
    `מזהה בקשה: ${input.requestId}`,
  ].join("\n")
}

function isRetryable(error: { statusCode: number | null }): boolean {
  return error.statusCode === null || error.statusCode >= 500
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

export async function deliverContactInquiry(
  input: ContactInquiryDeliveryInput,
): Promise<ContactInquiryDeliveryOutcome> {
  const mode = process.env.CONTACT_INQUIRY_DELIVERY_MODE

  if (mode === "simulate") {
    return { outcome: "delivered", mode: "simulate" }
  }

  if (mode !== "email") {
    return { outcome: "unavailable", mode: "unset", reason: "missing_configuration" }
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_INQUIRY_FROM
  const to = process.env.CONTACT_INQUIRY_TO

  if (!apiKey || !from || !to) {
    return { outcome: "unavailable", mode: "email", reason: "missing_configuration" }
  }

  const resend = new Resend(apiKey)
  const payload = {
    from,
    to,
    subject: `פנייה חדשה מהאתר – ${input.name}`,
    text: formatBody(input),
  }

  let attempt = 0
  while (attempt < 2) {
    attempt += 1

    try {
      const { data, error } = await withTimeout(
        resend.emails.send(payload, { idempotencyKey: input.requestId }),
        SEND_TIMEOUT_MS,
      )

      if (!error) {
        return { outcome: "delivered", mode: "email", providerMessageId: data.id }
      }

      if (attempt < 2 && isRetryable(error)) {
        continue
      }

      return { outcome: "unavailable", mode: "email", reason: "provider_error" }
    } catch {
      if (attempt < 2) {
        continue
      }

      return { outcome: "unavailable", mode: "email", reason: "timeout" }
    }
  }

  return { outcome: "unavailable", mode: "email", reason: "provider_error" }
}
