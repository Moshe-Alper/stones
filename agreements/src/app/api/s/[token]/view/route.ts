import { NextResponse } from "next/server"
import { markViewed } from "@/lib/agreement-repo"
import { errorResponse, logError, newRequestId } from "@/lib/api-error"

// Called by the signing page from the browser so link-preview bots don't count as a view.
export async function POST(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const requestId = newRequestId()
  const { token } = await params
  try {
    await markViewed(token)
    return NextResponse.json({ ok: true, requestId })
  } catch (error) {
    logError("mark-viewed", requestId, error)
    return errorResponse(500, "INTERNAL_ERROR", "שגיאה זמנית", requestId)
  }
}
