import { useTranslations } from "next-intl"
import { MessageCircle, Phone } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { CONTACT_DETAILS } from "@/data/contact"
import styles from "./ContactBand.module.css"

export default function ContactBand() {
  const t = useTranslations("ContactBand")
  const tServiceArea = useTranslations("ServiceArea")

  return (
    <section id="contact" className={styles.section} aria-label={t("sectionAriaLabel")}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <h2 className={styles.heading}>{t("heading")}</h2>
          <p className={styles.area}>{tServiceArea("summary")}</p>
        </div>
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
          <Link href="/contact" className={styles.form}>
            {t("leaveDetails")}
          </Link>
        </div>
      </div>
    </section>
  )
}
