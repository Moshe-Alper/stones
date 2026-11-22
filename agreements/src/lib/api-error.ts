import { NextResponse } from "next/server"

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "NOT_FOUND"
  | "AGREEMENT_UNAVAILABLE"
  | "INTERNAL_ERROR"

export function newRequestId(): string {
  return crypto.randomUUID()
}

export function errorResponse(
  status: number,
  code: ApiErrorCode,
  message: string,
  requestId: string,
  details?: unknown,
) {
  return NextResponse.json(
    { error: { code, message, ...(details ? { details } : {}) }, requestId },
    { status },
  )
}

export function logError(operation: string, requestId: string, error: unknown) {
  const reason = error instanceof Error ? error.message : "unknown"
  console.error(JSON.stringify({ level: "error", operation, requestId, reason }))
}
