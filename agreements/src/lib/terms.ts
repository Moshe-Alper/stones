import { createHash } from "node:crypto"

// DRAFT terms (Hebrew). Not reviewed by a lawyer — the owner decided to launch without review.
// Any change to the wording MUST bump TERMS_VERSION; the exact rendered text is stored with each signature.
export const TERMS_VERSION = "1"
export const BUSINESS_NAME = "שיש אלפר"
export const PAYMENT_DAYS = 7

export type TermsInput = {
  amountIls: number
  vatIncluded: boolean
  jobDescription: string
}

export type RenderedTerms = {
  version: string
  title: string
  clauses: string[]
  text: string
  hash: string
}

export function formatIls(amount: number): string {
  return `${amount.toLocaleString("he-IL")} ₪`
}

export function renderTerms(input: TermsInput): RenderedTerms {
  const vat = input.vatIncluded ? "כולל מע\"מ" : "לא כולל מע\"מ (יתווסף מע\"מ כחוק)"
  const title = "התחייבות לתשלום עבור פתיחת מצבה"
  const clauses = [
    `אני החתום מטה מבקש מ"${BUSINESS_NAME}" (להלן: "העוסק") לבצע פתיחה של מצבה קיימת, כמפורט להלן: ${input.jobDescription}.`,
    `תמורת הפתיחה אשלם לעוסק סך של ${formatIls(input.amountIls)}, ${vat}.`,
    `התשלום יבוצע תוך ${PAYMENT_DAYS} ימים ממועד ביצוע הפתיחה.`,
    "התחייבות התשלום אינה מותנית בכך שיתר העבודות במצבה, לרבות כיתוב, חריטה או עבודות נוספות, יבוצעו על ידי העוסק, ותחול גם אם יתר העבודות יבוצעו על ידי אחר.",
    "אני מצהיר כי אני מוסמך לבקש את הפתיחה מטעם המשפחה, וכי אני אחראי באופן אישי לתשלום הנ\"ל.",
    "העוסק יבצע את הפתיחה רק לאחר קבלת התחייבות זו חתומה.",
    "ניתן לבטל את הבקשה בהודעה לעוסק לפני תחילת ביצוע הפתיחה, ללא חיוב. לאחר שהפתיחה בוצעה לא ניתן לבטל את התחייבות התשלום.",
    "אני מאשר כי קראתי והבנתי את כל האמור לעיל, וכי חתימתי הדיגיטלית מהווה הסכמה מלאה ומחייבת.",
  ]
  const text = [title, ...clauses.map((clause, index) => `${index + 1}. ${clause}`)].join("\n")
  const hash = createHash("sha256").update(text, "utf8").digest("hex")
  return { version: TERMS_VERSION, title, clauses, text, hash }
}
