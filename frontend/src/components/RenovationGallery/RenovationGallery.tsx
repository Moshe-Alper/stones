import { useTranslations } from "next-intl";
import styles from "./RenovationGallery.module.css";

// TODO: replace with real before/after photography from client
const PLACEHOLDERS = [1, 2, 3];

export default function RenovationGallery() {
  const t = useTranslations("RenovationGallery");

  return (
    <section className={styles.section} aria-label={t("sectionAriaLabel")}>
      <h2 className={styles.heading}>{t("heading")}</h2>
      <p className={styles.intro}>{t("intro")}</p>
      <div className={styles.grid}>
        {PLACEHOLDERS.map((id) => (
          <div className={styles.pair} key={id}>
            <div className={styles.placeholder}>
              <span>{t("beforeLabel")}</span>
            </div>
            <div className={styles.placeholder}>
              <span>{t("afterLabel")}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
