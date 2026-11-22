import { NextResponse } from "next/server"
import { signAgreement } from "@/lib/agreement-repo"
import { errorResponse, logError, newRequestId } from "@/lib/api-error"
import { notifyOwnerSigned } from "@/lib/notify"
import { signAgreementSchema } from "@/lib/validation"

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const requestId = newRequestId()
  const { token } = await params

  const parsed = signAgreementSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return errorResponse(422, "VALIDATION_ERROR", "יש לתקן את השדות המסומנים", requestId, parsed.error.flatten().fieldErrors)
  }

  try {
    const userAgent = request.headers.get("user-agent")?.slice(0, 300) ?? null
    const agreement = await signAgreement(token, parsed.data, { userAgent })
    if (!agreement) {
      return errorResponse(409, "AGREEMENT_UNAVAILABLE", "ההסכם אינו זמין לחתימה (נחתם כבר, בוטל או שפג תוקפו)", requestId)
    }
    await notifyOwnerSigned(agreement, parsed.data.signerName, requestId)
    return NextResponse.json({ ok: true, requestId })
  } catch (error) {
    logError("sign-agreement", requestId, error)
    return errorResponse(500, "INTERNAL_ERROR", "לא הצלחנו לשמור את החתימה, נסו שוב", requestId)
  }
}
