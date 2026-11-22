import "server-only"
import { headers } from "next/headers"

export async function getBaseUrl(): Promise<string> {
  const configured = process.env.APP_BASE_URL?.replace(/\/$/, "")
  if (configured) return configured
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3100"
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")
  return `${proto}://${host}`
}

export function signUrl(baseUrl: string, token: string): string {
  return `${baseUrl}/s/${token}`
}
