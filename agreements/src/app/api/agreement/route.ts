import { NextResponse } from "next/server"
import { createAgreement } from "@/lib/agreement-repo"
import { errorResponse, logError, newRequestId } from "@/lib/api-error"
import { isOwnerAuthed } from "@/lib/auth"
import { getBaseUrl, signUrl } from "@/lib/base-url"
import { buildWhatsappUrl } from "@/lib/phone"
import { BUSINESS_NAME } from "@/lib/terms"
import { createAgreementSchema } from "@/lib/validation"

export async function POST(request: Request) {
  const requestId = newRequestId()
  if (!(await isOwnerAuthed())) {
    return errorResponse(401, "UNAUTHENTICATED", "יש להתחבר מחדש", requestId)
  }

  const parsed = createAgreementSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return errorResponse(422, "VALIDATION_ERROR", "הנתונים שהוזנו אינם תקינים", requestId, parsed.error.flatten().fieldErrors)
  }

  try {
    const agreement = await createAgreement(parsed.data)
    const url = signUrl(await getBaseUrl(), agreement.token)
    const message = `שלום ${agreement.clientName}, זה הלינק לחתימה על ההתחייבות לפתיחת המצבה (${BUSINESS_NAME}): ${url}`
    return NextResponse.json(
      { agreement, signUrl: url, whatsappUrl: buildWhatsappUrl(agreement.clientPhone, message), requestId },
      { status: 201 },
    )
  } catch (error) {
    logError("create-agreement", requestId, error)
    return errorResponse(500, "INTERNAL_ERROR", "לא הצלחנו ליצור את ההסכם, נסו שוב", requestId)
  }
}
