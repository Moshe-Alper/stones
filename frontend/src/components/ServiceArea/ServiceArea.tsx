import { useTranslations } from "next-intl";
import styles from "./ServiceArea.module.css";

export default function ServiceArea() {
  const t = useTranslations("ServiceArea");
  const towns = t.raw("towns") as string[];

  return (
    <section className={styles.section} aria-label={t("sectionAriaLabel")}>
      <div className={styles.inner}>
        <p className={styles.summary}>{t("summary")}</p>
        <ul className={styles.towns}>
          {towns.map((town) => (
            <li className={styles.chip} key={town}>
              {town}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
