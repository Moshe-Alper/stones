import { useTranslations } from "next-intl"
import styles from "./ProcessSteps.module.css"

const STEP_KEYS = ["step1Title", "step2Title", "step3Title", "step4Title"] as const

export default function ProcessSteps() {
  const t = useTranslations("ProcessSteps")

  return (
    <section className={styles.section} aria-label={t("sectionAriaLabel")}>
      <ol className={styles.steps}>
        {STEP_KEYS.map((key, index) => (
          <li className={styles.step} key={key}>
            <span className={styles.stepNumber} aria-hidden="true">
              {index + 1}
            </span>
            <span className={styles.stepTitle}>{t(key)}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
