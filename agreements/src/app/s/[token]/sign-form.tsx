"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type FieldErrors = Record<string, string[] | undefined>

export function SignForm({ token, defaultName }: { token: string; defaultName: string }) {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [hasInk, setHasInk] = useState(false)
  const [signerName, setSignerName] = useState(defaultName)
  const [signerIdNumber, setSignerIdNumber] = useState("")
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    // Mark as viewed from the browser (not the server render) so link-preview bots don't count.
    fetch(`/api/s/${token}/view`, { method: "POST" }).catch(() => undefined)
  }, [token])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ratio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2.2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#111"
  }, [])

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  function onDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = event.currentTarget.getContext("2d")
    if (!ctx) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drawing.current = true
    const { x, y } = point(event)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 0.01, y)
    ctx.stroke()
    setHasInk(true)
  }

  function onMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const ctx = event.currentTarget.getContext("2d")
    if (!ctx) return
    const { x, y } = point(event)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  function onUp() {
    drawing.current = false
  }

  function clearPad() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
    setHasInk(false)
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setFieldErrors({})
    if (!hasInk) {
      setError("יש לחתום במסגרת החתימה")
      return
    }
    setBusy(true)
    try {
      const response = await fetch(`/api/s/${token}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signerName,
          signerIdNumber,
          consent,
          signatureImage: canvasRef.current?.toDataURL("image/png"),
        }),
      })
      const body = await response.json().catch(() => null)
      if (!response.ok) {
        setError(body?.error?.message ?? "החתימה נכשלה, נסו שוב")
        setFieldErrors(body?.error?.details ?? {})
        if (response.status === 409) router.refresh()
        return
      }
      router.refresh()
    } catch {
      setError("אין חיבור לשרת, נסו שוב")
    } finally {
      setBusy(false)
    }
  }

  const fieldError = (name: string) =>
    fieldErrors[name]?.[0] ? <p className="field-error">{fieldErrors[name]?.[0]}</p> : null

  return (
    <form onSubmit={onSubmit}>
      <h2 style={{ marginTop: 0 }}>חתימה</h2>
      <label htmlFor="signerName">שם מלא</label>
      <input id="signerName" type="text" autoComplete="name" value={signerName} onChange={(e) => setSignerName(e.target.value)} />
      {fieldError("signerName")}
      <label htmlFor="signerIdNumber">מספר תעודת זהות</label>
      <input id="signerIdNumber" type="text" inputMode="numeric" autoComplete="off" value={signerIdNumber} onChange={(e) => setSignerIdNumber(e.target.value)} />
      {fieldError("signerIdNumber")}
      <label>חתימה (באצבע או בעכבר)</label>
      <canvas
        ref={canvasRef}
        className="signature-pad"
        aria-label="משטח חתימה"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />
      <div className="actions">
        <button type="button" className="secondary" onClick={clearPad}>נקה חתימה</button>
      </div>
      <label className="check" htmlFor="consent">
        <input id="consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>קראתי והבנתי את התנאים, ואני מתחייב/ת לשלם את הסכום הנקוב</span>
      </label>
      {fieldError("consent")}
      {error ? <p className="error" role="alert">{error}</p> : null}
      <div className="actions">
        <button type="submit" disabled={busy || !consent}>{busy ? "שומר..." : "חתום ושלח"}</button>
      </div>
    </form>
  )
}
