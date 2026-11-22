"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function LoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        setError(body?.error?.message ?? "ההתחברות נכשלה, נסו שוב")
        return
      }
      router.replace("/")
      router.refresh()
    } catch {
      setError("אין חיבור לשרת, נסו שוב")
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="password">סיסמה</label>
      <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error ? <p className="error" role="alert">{error}</p> : null}
      <div className="actions">
        <button type="submit" disabled={busy || password.length === 0}>{busy ? "נכנס..." : "כניסה"}</button>
      </div>
    </form>
  )
}
