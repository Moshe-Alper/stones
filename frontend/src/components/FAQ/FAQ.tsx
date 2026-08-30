import { useTranslations } from "next-intl";
import styles from "./FAQ.module.css";

export default function FAQ() {
  const t = useTranslations("FAQ");
  const tServiceArea = useTranslations("ServiceArea");

  const QUESTIONS = [
    { q: t("q1Question"), a: t("q1AnswerTemplate", { summary: tServiceArea("summary") }) },
    { q: t("q2Question"), a: t("q2Answer") },
    { q: t("q3Question"), a: t("q3Answer") },
    { q: t("q4Question"), a: t("q4Answer") },
    { q: t("q5Question"), a: t("q5Answer") },
    { q: t("q6Question"), a: t("q6Answer") },
  ];

  return (
    <section id="faq" className={styles.section} aria-label={t("sectionAriaLabel")}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{t("heading")}</h2>
        <div className={styles.list}>
          {QUESTIONS.map((item) => (
            <details className={styles.item} key={item.q}>
              <summary className={styles.question}>{item.q}</summary>
              <p className={styles.answer}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
