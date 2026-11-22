"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type Created = { signUrl: string; whatsappUrl: string }
type FieldErrors = Record<string, string[] | undefined>

export function CreateForm() {
  const router = useRouter()
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [amountIls, setAmountIls] = useState("")
  const [vatIncluded, setVatIncluded] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [created, setCreated] = useState<Created | null>(null)
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setFieldErrors({})
    setCreated(null)
    try {
      const response = await fetch("/api/agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, clientPhone, jobDescription, amountIls, vatIncluded }),
      })
      const body = await response.json().catch(() => null)
      if (response.status === 401) {
        router.replace("/login")
        return
      }
      if (!response.ok) {
        setError(body?.error?.message ?? "יצירת ההסכם נכשלה")
        setFieldErrors(body?.error?.details ?? {})
        return
      }
      setCreated({ signUrl: body.signUrl, whatsappUrl: body.whatsappUrl })
      setCopied(false)
      setClientName("")
      setClientPhone("")
      setJobDescription("")
      setAmountIls("")
      router.refresh()
    } catch {
      setError("אין חיבור לשרת, נסו שוב")
    } finally {
      setBusy(false)
    }
  }

  async function copyLink() {
    if (!created) return
    try {
      await navigator.clipboard.writeText(created.signUrl)
      setCopied(true)
    } catch {
      setError("ההעתקה נכשלה, אפשר להעתיק ידנית מהתיבה")
    }
  }

  const fieldError = (name: string) =>
    fieldErrors[name]?.[0] ? <p className="field-error">{fieldErrors[name]?.[0]}</p> : null

  return (
    <form onSubmit={onSubmit}>
      <h2 style={{ marginTop: 0 }}>הסכם חדש</h2>
      <div className="row">
        <div>
          <label htmlFor="clientName">שם הלקוח</label>
          <input id="clientName" type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          {fieldError("clientName")}
        </div>
        <div>
          <label htmlFor="clientPhone">טלפון (לשליחה בווטסאפ)</label>
          <input id="clientPhone" type="tel" inputMode="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
        </div>
      </div>
      <label htmlFor="jobDescription">תיאור העבודה</label>
      <textarea id="jobDescription" placeholder="למשל: פתיחת מצבה כפולה, בית עלמין X, על שם Y" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
      {fieldError("jobDescription")}
      <label htmlFor="amountIls">סכום (₪)</label>
      <input id="amountIls" type="number" inputMode="numeric" min={1} value={amountIls} onChange={(e) => setAmountIls(e.target.value)} />
      {fieldError("amountIls")}
      <label className="check" htmlFor="vatIncluded">
        <input id="vatIncluded" type="checkbox" checked={vatIncluded} onChange={(e) => setVatIncluded(e.target.checked)} />
        <span>הסכום כולל מע&quot;מ</span>
      </label>
      {error ? <p className="error" role="alert">{error}</p> : null}
      <div className="actions">
        <button type="submit" disabled={busy}>{busy ? "יוצר..." : "צור לינק"}</button>
      </div>
      {created ? (
        <div className="card" style={{ marginTop: 16 }}>
          <strong>הלינק מוכן</strong>
          <p className="link-box">{created.signUrl}</p>
          <div className="actions">
            <a className="button" href={created.whatsappUrl} target="_blank" rel="noreferrer">שלח בווטסאפ</a>
            <button type="button" className="secondary" onClick={copyLink}>{copied ? "הועתק" : "העתק לינק"}</button>
          </div>
        </div>
      ) : null}
    </form>
  )
}
