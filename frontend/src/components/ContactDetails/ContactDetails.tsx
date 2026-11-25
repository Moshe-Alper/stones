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
        aria-label={`${t("addressCardLabel")}: ${CONTACT_DETAILS.addressLine}`}
      >
        <MapPin size={18} aria-hidden="true" />
        <span>{CONTACT_DETAILS.addressLine}</span>
      </a>
      <a
        className={styles.item}
        href={`mailto:${CONTACT_DETAILS.email}`}
        aria-label={`${t("emailCardLabel")}: ${CONTACT_DETAILS.email}`}
      >
        <Mail size={18} aria-hidden="true" />
        <span dir="ltr">{CONTACT_DETAILS.email}</span>
      </a>
    </section>
  )
}
