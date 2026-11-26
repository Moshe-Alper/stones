import { useTranslations } from "next-intl"
import { Mail, MapPin } from "lucide-react"
import { CONTACT_DETAILS } from "@/data/contact"
import styles from "./ContactDetails.module.css"

// Compact address + email line under the form. Phone/WhatsApp live in the hero and
// the service area in the FAQ, so they are not repeated here (.plan/021).
export default function ContactDetails() {
  const t = useTranslations("ContactDetails")

  return (
    <section className={styles.details} aria-label={t("sectionAriaLabel")}>
      <a
        className={styles.item}
        href={CONTACT_DETAILS.mapsUrl}
        target="_blank"
        rel="noreferrer"
      >
        <MapPin size={18} aria-hidden="true" />
        <span className="visually-hidden">{t("addressCardLabel")}: </span>
        {/* The address stays Hebrew on every locale (.plan/017), so mark its language (.plan/024). */}
        <span lang="he" dir="rtl">{CONTACT_DETAILS.addressLine}</span>
      </a>
      <a
        className={styles.item}
        href={`mailto:${CONTACT_DETAILS.email}`}
      >
        <Mail size={18} aria-hidden="true" />
        <span className="visually-hidden">{t("emailCardLabel")}: </span>
        <span dir="ltr">{CONTACT_DETAILS.email}</span>
      </a>
    </section>
  )
}
