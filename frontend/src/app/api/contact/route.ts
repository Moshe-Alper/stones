import { getTranslations } from "next-intl/server"
import { deliverContactInquiry } from "@/lib/contact-inquiry-delivery"
import {
  getPreferredTimeLabelHe,
  isPreferredTimeOptionId,
  type ContactInquiry,
} from "@/data/contact"
import { routing } from "@/i18n/routing"

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

function resolveLocale(request: Request): (typeof routing.locales)[number] {
  const requested = request.headers.get("x-locale")
  return (routing.locales as readonly string[]).includes(requested ?? "")
    ? (requested as (typeof routing.locales)[number])
    : routing.defaultLocale
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID()
  const locale = resolveLocale(request)
  const t = await getTranslations({ locale, namespace: "ApiErrors" })

  function genericInvalidResponse() {
    return Response.json(
      {
        error: {
          code: "INVALID_CONTACT_INQUIRY",
          message: t("invalidBody"),
        },
        requestId,
      },
      { status: 422 },
    )
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0")
  if (contentLength > MAX_BODY_BYTES) {
    return genericInvalidResponse()
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json(
      {
        error: {
          code: "INVALID_JSON",
          message: t("invalidJson"),
        },
        requestId,
      },
      { status: 400 },
    )
  }

  if (!isRecord(body)) {
    return genericInvalidResponse()
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
    details.name = t("nameRequired")
  } else if (inquiry.name.length > MAX_NAME_LENGTH) {
    details.name = t("nameTooLong")
  }

  if (!/^[0-9+()\-\s]{7,20}$/.test(inquiry.phone)) {
    details.phone = t("phoneInvalid")
  }

  if (!isPreferredTimeOptionId(inquiry.preferredTime)) {
    details.preferredTime = t("preferredTimeInvalid")
  }

  if (!inquiry.message) {
    details.message = t("messageRequired")
  } else if (inquiry.message.length > MAX_MESSAGE_LENGTH) {
    details.message = t("messageTooLong")
  }

  if (Object.keys(details).length > 0) {
    return Response.json(
      {
        error: {
          code: "INVALID_CONTACT_INQUIRY",
          message: t("invalidBody"),
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
    // The owner's notification email always reads in Hebrew, regardless of the
    // visitor's site language — see .plan/017.
    preferredTime: getPreferredTimeLabelHe(inquiry.preferredTime),
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
          message: t("deliveryUnavailable"),
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
