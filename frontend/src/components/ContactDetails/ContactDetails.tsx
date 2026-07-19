import { CONTACT_DETAILS } from "@/data/contact"
import styles from "./ContactDetails.module.css"

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7.2 3.5 10 7.7 8.2 9.5c1.2 2.4 3.1 4.3 5.5 5.5l1.8-1.8 4.2 2.8-.8 4c-.2.7-.8 1.1-1.5 1C9.7 20.1 3.9 14.3 3 6.6c-.1-.7.3-1.3 1-1.5l3.2-.6Z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

export default function ContactDetails() {
  return (
    <section className={styles.details} aria-label="פרטי התקשרות">
      <a
        className={styles.card}
        href={CONTACT_DETAILS.mapsUrl}
        target="_blank"
        rel="noreferrer"
      >
        <span className={styles.icon}>
          <PinIcon />
        </span>
        <span className={styles.copy}>
          <strong>כתובת הסטודיו</strong>
          <span>{CONTACT_DETAILS.addressLine}</span>
        </span>
      </a>

      <a className={styles.card} href={CONTACT_DETAILS.phoneHref}>
        <span className={styles.icon}>
          <PhoneIcon />
        </span>
        <span className={styles.copy}>
          <strong>טלפון ישיר</strong>
          <span dir="ltr">{CONTACT_DETAILS.directPhone}</span>
        </span>
      </a>

      <a className={styles.email} href={`mailto:${CONTACT_DETAILS.email}`}>
        <span className={styles.icon}>
          <MailIcon />
        </span>
        <span>
          <strong>דואר אלקטרוני</strong>
          <span dir="ltr">{CONTACT_DETAILS.email}</span>
        </span>
      </a>
    </section>
  )
}
