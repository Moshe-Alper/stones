import { NextResponse } from "next/server"
import { cancelAgreement } from "@/lib/agreement-repo"
import { errorResponse, logError, newRequestId } from "@/lib/api-error"
import { isOwnerAuthed } from "@/lib/auth"

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = newRequestId()
  if (!(await isOwnerAuthed())) {
    return errorResponse(401, "UNAUTHENTICATED", "יש להתחבר מחדש", requestId)
  }
  const { id } = await params
  try {
    const cancelled = await cancelAgreement(id)
    if (!cancelled) {
      return errorResponse(409, "AGREEMENT_UNAVAILABLE", "ההסכם כבר נחתם או בוטל", requestId)
    }
    return NextResponse.json({ ok: true, requestId })
  } catch (error) {
    logError("cancel-agreement", requestId, error)
    return errorResponse(500, "INTERNAL_ERROR", "לא הצלחנו לבטל את ההסכם, נסו שוב", requestId)
  }
}
