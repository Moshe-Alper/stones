import { createHmac, timingSafeEqual } from "node:crypto"

export const SESSION_COOKIE = "owner_session"
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url")
}

export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function createSessionValue(secret: string, nowMs: number = Date.now()): string {
  const expiresAt = String(Math.floor(nowMs / 1000) + SESSION_MAX_AGE_SECONDS)
  return `${expiresAt}.${sign(expiresAt, secret)}`
}

export function verifySessionValue(
  value: string | undefined,
  secret: string,
  nowMs: number = Date.now(),
): boolean {
  if (!value || !secret) return false
  const [expiresAt, signature] = value.split(".")
  if (!expiresAt || !signature) return false
  if (!safeEqual(signature, sign(expiresAt, secret))) return false
  return Number(expiresAt) * 1000 > nowMs
}
