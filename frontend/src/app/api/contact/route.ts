import { PREFERRED_TIME_OPTIONS, type ContactInquiry } from "@/data/contact"

type ValidationDetails = Partial<Record<keyof ContactInquiry, string>>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID()
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

  const inquiry: ContactInquiry = {
    name: getString(body.name),
    phone: getString(body.phone),
    preferredTime: getString(body.preferredTime),
    message: getString(body.message),
  }
  const details: ValidationDetails = {}

  if (!inquiry.name) details.name = "יש להזין שם מלא."
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
  if (!inquiry.message) details.message = "יש להזין הודעה."

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

  // TODO: Replace this local delivery log with the approved email provider.
  console.info("contact_inquiry_simulated_delivery", {
    requestId,
    operation: "create_contact_inquiry",
    inquiry,
  })

  return Response.json(
    {
      data: {
        delivered: true,
        mode: "simulated",
      },
      requestId,
    },
    { status: 200 },
  )
}
