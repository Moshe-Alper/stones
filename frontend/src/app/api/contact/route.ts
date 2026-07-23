import { deliverContactInquiry } from "@/lib/contact-inquiry-delivery"
import { PREFERRED_TIME_OPTIONS, type ContactInquiry } from "@/data/contact"

type ValidationDetails = Partial<Record<keyof ContactInquiry, string>>

const MAX_BODY_BYTES = 20 * 1024
const MAX_NAME_LENGTH = 100
const MAX_MESSAGE_LENGTH = 2000

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function genericInvalidResponse(requestId: string) {
  return Response.json(
    {
      error: {
        code: "INVALID_CONTACT_INQUIRY",
        message: "פרטי הפנייה חסרים או אינם תקינים.",
      },
      requestId,
    },
    { status: 422 },
  )
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID()

  const contentLength = Number(request.headers.get("content-length") ?? "0")
  if (contentLength > MAX_BODY_BYTES) {
    return genericInvalidResponse(requestId)
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json(
      {
        error: {
          code: "INVALID_JSON",
          message: "גוף הבקשה אינו JSON תקין.",
        },
        requestId,
      },
      { status: 400 },
    )
  }

  if (!isRecord(body)) {
    return genericInvalidResponse(requestId)
  }

  const inquiry: ContactInquiry = {
    name: getString(body.name),
    phone: getString(body.phone),
    preferredTime: getString(body.preferredTime),
    message: getString(body.message),
    website: getString(body.website),
  }
  const details: ValidationDetails = {}

  if (!inquiry.name) {
    details.name = "יש להזין שם מלא."
  } else if (inquiry.name.length > MAX_NAME_LENGTH) {
    details.name = "השם ארוך מדי."
  }

  if (!/^[0-9+()\-\s]{7,20}$/.test(inquiry.phone)) {
    details.phone = "יש להזין מספר טלפון תקין."
  }

  if (
    !PREFERRED_TIME_OPTIONS.includes(
      inquiry.preferredTime as (typeof PREFERRED_TIME_OPTIONS)[number],
    )
  ) {
    details.preferredTime = "יש לבחור זמן מועדף מהרשימה."
  }

  if (!inquiry.message) {
    details.message = "יש להזין הודעה."
  } else if (inquiry.message.length > MAX_MESSAGE_LENGTH) {
    details.message = "ההודעה ארוכה מדי."
  }

  if (Object.keys(details).length > 0) {
    return Response.json(
      {
        error: {
          code: "INVALID_CONTACT_INQUIRY",
          message: "פרטי הפנייה חסרים או אינם תקינים.",
          details,
        },
        requestId,
      },
      { status: 422 },
    )
  }

  if (inquiry.website) {
    console.info("contact_inquiry_delivery", {
      requestId,
      operation: "create_contact_inquiry",
      outcome: "honeypot_rejected",
    })

    return Response.json(
      {
        data: { delivered: true, mode: "email" },
        requestId,
      },
      { status: 200 },
    )
  }

  const result = await deliverContactInquiry({
    requestId,
    name: inquiry.name,
    phone: inquiry.phone,
    preferredTime: inquiry.preferredTime,
    message: inquiry.message,
  })

  console.info("contact_inquiry_delivery", {
    requestId,
    operation: "create_contact_inquiry",
    outcome: result.outcome,
    mode: result.mode,
    providerMessageId:
      result.outcome === "delivered" && result.mode === "email"
        ? result.providerMessageId
        : undefined,
  })

  if (result.outcome === "unavailable") {
    return Response.json(
      {
        error: {
          code: "CONTACT_DELIVERY_UNAVAILABLE",
          message:
            "לא הצלחנו לשלוח את הבקשה כעת. נסו שוב בעוד מספר דקות או צרו קשר טלפוני.",
        },
        requestId,
      },
      { status: 503 },
    )
  }

  return Response.json(
    {
      data: { delivered: true, mode: result.mode },
      requestId,
    },
    { status: 200 },
  )
}
