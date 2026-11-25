import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./CatalogGrid.module.css";
import { CATEGORIES } from "./categories";
import { getCategoryThumbnail } from "@/data/gallery";

export default function CatalogGrid() {
  const t = useTranslations("CatalogGrid");
  const tCategories = useTranslations("Categories");
  const count = CATEGORIES.length;

  return (
    <section className={styles.section} aria-label={t("sectionAriaLabel")}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.subtitle}>{t("subtitle")}</p>
        </div>
        <p className={styles.count}>{t("countLabel", { count })}</p>
      </div>

      <div className={styles.grid}>
        {CATEGORIES.map((category) => {
          const thumbnail = getCategoryThumbnail(category.slug);
          const title = tCategories(`${category.slug}.title`);
          const description = tCategories(`${category.slug}.description`);

          return (
            <article className={styles.card} key={category.id}>
              <div className={styles.cardImage}>
                {category.featured ? (
                  <span className={styles.badge}>{t("badgeFeatured")}</span>
                ) : null}
                {thumbnail ? (
                  <Image
                    src={`/images/gallery/${thumbnail.file}`}
                    alt={title}
                    fill
                    sizes="(max-width: 700px) 100vw, 50vw"
                    className={styles.cardImagePhoto}
                  />
                ) : (
                  <span className={styles.placeholderMark} aria-hidden="true">
                    +
                  </span>
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDescription}>{description}</p>
                <Link
                  href={`/catalog/${category.slug}`}
                  className={styles.cardLink}
                >
                  {t("viewGallery")}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
