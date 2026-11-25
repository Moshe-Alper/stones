import { useTranslations } from "next-intl"
import { MessageCircle } from "lucide-react"
import { CONTACT_DETAILS } from "@/data/contact"
import styles from "./WhatsAppFab.module.css"

// Mobile-only floating WhatsApp button, shown on every page (.plan/020, question 5).
export default function WhatsAppFab() {
  const t = useTranslations("WhatsAppFab")

  return (
    <a
      href={CONTACT_DETAILS.whatsappHref}
      className={styles.fab}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("ariaLabel")}
    >
      <MessageCircle size={28} aria-hidden="true" />
    </a>
  )
}
