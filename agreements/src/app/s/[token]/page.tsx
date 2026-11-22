import type { Metadata } from "next"
import { getAgreementByToken, getSignedRecord } from "@/lib/agreement-repo"
import { isOwnerAuthed } from "@/lib/auth"
import { BUSINESS_NAME, formatIls, renderTerms } from "@/lib/terms"
import { SignForm } from "./sign-form"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "התחייבות לפתיחת מצבה", robots: { index: false, follow: false } }

function maskId(id: string): string {
  return id.length <= 3 ? id : `${"*".repeat(id.length - 3)}${id.slice(-3)}`
}

function Unavailable({ title, text }: { title: string; text: string }) {
  return (
    <div className="card">
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  )
}

export default async function SignPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const agreement = await getAgreementByToken(token)

  if (!agreement) {
    return <Unavailable title="הלינק אינו תקין" text="לא מצאנו הסכם עבור הלינק הזה. אפשר לפנות אלינו לקבלת לינק חדש." />
  }
  if (agreement.status === "cancelled") {
    return <Unavailable title="ההסכם בוטל" text="הלינק הזה כבר אינו פעיל." />
  }
  if (agreement.status === "expired") {
    return <Unavailable title="פג תוקף הלינק" text="אפשר לפנות אלינו לקבלת לינק חדש." />
  }

  const terms = renderTerms({
    amountIls: agreement.amountIls,
    vatIncluded: agreement.vatIncluded,
    jobDescription: agreement.jobDescription,
  })

  if (agreement.status === "signed") {
    const record = await getSignedRecord(agreement.id)
    const owner = await isOwnerAuthed()
    return (
      <>
        <h1>ההתחייבות נחתמה</h1>
        <div className="card terms">
          <h2 style={{ marginTop: 0 }}>{record?.termsText.split("\n")[0] ?? terms.title}</h2>
          <ol>
            {(record?.termsText.split("\n").slice(1) ?? terms.clauses).map((line, index) => (
              <li key={index}>{line.replace(/^\d+\.\s/, "")}</li>
            ))}
          </ol>
          {record ? (
            <>
              <p>
                <strong>{record.signerName}</strong> · ת.ז. {owner ? record.signerIdNumber : maskId(record.signerIdNumber)}
                <br />
                <span className="muted">נחתם ב-{new Date(record.signedAt).toLocaleString("he-IL")} · נוסח גרסה {record.termsVersion}</span>
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="signed-image" src={record.signatureImage} alt="חתימה" width={320} />
            </>
          ) : null}
        </div>
        <div className="actions no-print">
          <button type="button" className="secondary" id="print-button">הדפס / שמור כ-PDF</button>
        </div>
        <script dangerouslySetInnerHTML={{ __html: "document.getElementById('print-button')?.addEventListener('click',()=>window.print())" }} />
      </>
    )
  }

  return (
    <>
      <h1>{BUSINESS_NAME} · התחייבות לפתיחת מצבה</h1>
      <div className="card terms">
        <div className="muted">הסכום לתשלום</div>
        <div className="amount">{formatIls(agreement.amountIls)}</div>
        <ol>
          {terms.clauses.map((clause, index) => (
            <li key={index}>{clause}</li>
          ))}
        </ol>
      </div>
      <div className="card">
        <SignForm token={token} defaultName={agreement.clientName} />
      </div>
    </>
  )
}
