import { useTranslations } from "next-intl"
import styles from "./ContactHero.module.css"

export default function ContactHero() {
  const t = useTranslations("ContactHero")

  return (
    <section className={styles.hero} aria-labelledby="contact-heading">
      <h1 id="contact-heading" className={styles.heading}>
        {t("heading")}
      </h1>
      <span className={styles.divider} aria-hidden="true" />
      <p className={styles.subtitle}>{t("subtitle")}</p>
    </section>
  )
}
