import "server-only"
import { cookies } from "next/headers"
import { SESSION_COOKIE, verifySessionValue } from "@/lib/session"

export async function isOwnerAuthed(): Promise<boolean> {
  const store = await cookies()
  return verifySessionValue(store.get(SESSION_COOKIE)?.value, process.env.SESSION_SECRET ?? "")
}
