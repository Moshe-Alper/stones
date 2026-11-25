import { useTranslations } from "next-intl";
import styles from "./ProcessSteps.module.css";

export default function ProcessSteps() {
  const t = useTranslations("ProcessSteps");

  const STEPS = [
    { number: "01", title: t("step1Title"), desc: t("step1Desc") },
    { number: "02", title: t("step2Title"), desc: t("step2Desc") },
    { number: "03", title: t("step3Title"), desc: t("step3Desc") },
    { number: "04", title: t("step4Title"), desc: t("step4Desc") },
  ];

  return (
    <section className={styles.section} aria-label={t("sectionAriaLabel")}>
      <div className={styles.inner}>
        <div className={styles.headingCol}>
          <h2 className={styles.heading}>{t("heading")}</h2>
          <p className={styles.intro}>{t("intro")}</p>
        </div>
        <ol className={styles.steps}>
          {STEPS.map((step) => (
            <li className={styles.step} key={step.number}>
              <span className={styles.stepNumber}>{step.number}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
