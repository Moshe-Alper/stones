import { NextResponse } from "next/server"
import { errorResponse, newRequestId } from "@/lib/api-error"
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, createSessionValue, safeEqual } from "@/lib/session"
import { loginSchema } from "@/lib/validation"

export async function POST(request: Request) {
  const requestId = newRequestId()
  const password = process.env.OWNER_PASSWORD
  const secret = process.env.SESSION_SECRET
  if (!password || !secret) {
    console.error(JSON.stringify({ level: "error", operation: "login", requestId, reason: "owner auth not configured" }))
    return errorResponse(500, "INTERNAL_ERROR", "ההתחברות אינה מוגדרת בשרת", requestId)
  }

  const parsed = loginSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success || !safeEqual(parsed.data.password, password)) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return errorResponse(401, "UNAUTHENTICATED", "הסיסמה שגויה", requestId)
  }

  const response = NextResponse.json({ ok: true, requestId })
  response.cookies.set(SESSION_COOKIE, createSessionValue(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return response
}
