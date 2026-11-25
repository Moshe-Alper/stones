import { useTranslations } from "next-intl"
import { MessageCircle, Phone } from "lucide-react"
import { CONTACT_DETAILS } from "@/data/contact"
import styles from "./ContactHero.module.css"

// Calling or WhatsApp is how most families reach out, so those come first; the
// form follows for anyone who prefers to be called back (.plan/021).
export default function ContactHero() {
  const t = useTranslations("ContactHero")

  return (
    <section className={styles.hero} aria-labelledby="contact-heading">
      <h1 id="contact-heading" className={styles.heading}>
        {t("heading")}
      </h1>
      <div className={styles.actions}>
        <a
          href={CONTACT_DETAILS.phoneHref}
          className={styles.phone}
          aria-label={t("callAriaLabel", { phone: CONTACT_DETAILS.directPhone })}
        >
          <Phone size={20} aria-hidden="true" />
          <span dir="ltr">{CONTACT_DETAILS.directPhone}</span>
        </a>
        <a
          href={CONTACT_DETAILS.whatsappHref}
          className={styles.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={20} aria-hidden="true" />
          {t("whatsapp")}
        </a>
      </div>
      <p className={styles.formIntro}>{t("formIntro")}</p>
    </section>
  )
}
