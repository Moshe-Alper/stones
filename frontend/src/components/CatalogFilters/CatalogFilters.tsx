import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./CatalogFilters.module.css";

// The material/style/price filter controls that used to live here were removed:
// this page only ever shows the 4 fixed categories (the material list *is* the
// page), and there was never real style/price data to filter by. Real style
// filtering now lives where there's enough content for it to matter — see
// CategoryGallery on the per-category gallery pages.
export default function CatalogFilters() {
  const t = useTranslations("CatalogFilters");

  return (
    <aside className={styles.sidebar} aria-label={t("sidebarAriaLabel")}>
      <div className={styles.ctaBox}>
        <p className={styles.ctaText}>{t("ctaText")}</p>
        <Link href="/contact" className={styles.ctaButton}>
          {t("ctaButton")}
        </Link>
      </div>
    </aside>
  );
}
