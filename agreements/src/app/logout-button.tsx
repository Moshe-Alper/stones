"use client"

import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()
  async function onClick() {
    await fetch("/api/logout", { method: "POST" })
    router.replace("/login")
    router.refresh()
  }
  return (
    <button type="button" className="secondary" onClick={onClick}>
      יציאה
    </button>
  )
}
