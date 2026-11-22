import { redirect } from "next/navigation"
import { listAgreements } from "@/lib/agreement-repo"
import { isOwnerAuthed } from "@/lib/auth"
import { getBaseUrl, signUrl } from "@/lib/base-url"
import { buildWhatsappUrl } from "@/lib/phone"
import { BUSINESS_NAME } from "@/lib/terms"
import { AgreementItem } from "./agreement-item"
import { CreateForm } from "./create-form"
import { LogoutButton } from "./logout-button"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  if (!(await isOwnerAuthed())) redirect("/login")

  const [agreements, baseUrl] = await Promise.all([listAgreements(), getBaseUrl()])
  const items = agreements.map((agreement) => {
    const url = signUrl(baseUrl, agreement.token)
    const message = `שלום ${agreement.clientName}, זה הלינק לחתימה על ההתחייבות לפתיחת המצבה (${BUSINESS_NAME}): ${url}`
    return { agreement, signUrl: url, whatsappUrl: buildWhatsappUrl(agreement.clientPhone, message) }
  })

  return (
    <>
      <div className="topbar">
        <h1>התחייבות לפתיחת מצבה</h1>
        <LogoutButton />
      </div>
      <div className="card">
        <CreateForm />
      </div>
      <h2>הסכמים</h2>
      {items.length === 0 ? <p className="muted">עוד לא נוצרו הסכמים.</p> : null}
      {items.map((item) => (
        <AgreementItem key={item.agreement.id} {...item} />
      ))}
    </>
  )
}
