"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import type { Agreement } from "@/lib/agreement-repo"

const STATUS_LABEL: Record<Agreement["status"], string> = {
  created: "נשלח, טרם נפתח",
  viewed: "נפתח, טרם נחתם",
  signed: "נחתם",
  cancelled: "בוטל",
  expired: "פג תוקף",
}

type Props = { agreement: Agreement; signUrl: string; whatsappUrl: string }

export function AgreementItem({ agreement, signUrl, whatsappUrl }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const open = agreement.status === "created" || agreement.status === "viewed"

  async function cancel() {
    if (!window.confirm("לבטל את ההסכם? הלינק יפסיק לעבוד.")) return
    setError(null)
    try {
      const response = await fetch(`/api/agreement/${agreement.id}/cancel`, { method: "POST" })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        setError(body?.error?.message ?? "הביטול נכשל")
        return
      }
      router.refresh()
    } catch {
      setError("אין חיבור לשרת, נסו שוב")
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(signUrl)
      setCopied(true)
    } catch {
      setError("ההעתקה נכשלה")
    }
  }

  return (
    <div className="card">
      <div className="topbar">
        <strong>{agreement.clientName}</strong>
        <span className={`badge ${agreement.status}`}>{STATUS_LABEL[agreement.status]}</span>
      </div>
      <div>{agreement.amountIls.toLocaleString("he-IL")} ₪ · {agreement.jobDescription}</div>
      <div className="muted">נוצר {new Date(agreement.createdAt).toLocaleDateString("he-IL")} · תוקף עד {new Date(agreement.expiresAt).toLocaleDateString("he-IL")}</div>
      {error ? <p className="error" role="alert">{error}</p> : null}
      <div className="actions">
        {open ? (
          <>
            <a className="button" href={whatsappUrl} target="_blank" rel="noreferrer">שלח בווטסאפ</a>
            <button type="button" className="secondary" onClick={copy}>{copied ? "הועתק" : "העתק לינק"}</button>
            <button type="button" className="danger" onClick={cancel}>בטל</button>
          </>
        ) : null}
        {agreement.status === "signed" ? (
          <a className="button secondary" href={signUrl} target="_blank" rel="noreferrer">צפה בהסכם החתום</a>
        ) : null}
      </div>
    </div>
  )
}
