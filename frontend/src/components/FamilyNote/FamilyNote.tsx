import { useTranslations } from "next-intl"
import { BUSINESS_FOUNDED_YEAR } from "@/data/contact"
import styles from "./FamilyNote.module.css"

export default function FamilyNote() {
  const t = useTranslations("FamilyNote")

  return (
    <section className={styles.section} aria-label={t("sectionAriaLabel")}>
      <span className={styles.eyebrow}>{t("eyebrow", { year: String(BUSINESS_FOUNDED_YEAR) })}</span>
      <h2 className={styles.statement}>{t("statement")}</h2>
    </section>
  )
}
