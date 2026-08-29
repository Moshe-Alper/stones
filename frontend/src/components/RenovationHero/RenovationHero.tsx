import { useTranslations } from "next-intl";
import styles from "./RenovationHero.module.css";

export default function RenovationHero() {
  const t = useTranslations("RenovationHero");

  return (
    <section className={styles.hero} aria-labelledby="renovation-heading">
      <h1 id="renovation-heading" className={styles.heading}>
        {t("heading")}
      </h1>
      <span className={styles.divider} aria-hidden="true" />
      <p className={styles.subtitle}>{t("subtitle")}</p>
    </section>
  );
}
