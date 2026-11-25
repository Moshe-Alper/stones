import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { CATEGORIES, type CategorySlug } from "@/components/CatalogGrid/categories"
import { getCategoryThumbnail } from "@/data/gallery"
import styles from "./CategoryTiles.module.css"

const POPULAR_CATEGORY: CategorySlug = "hebron-marble"

export default function CategoryTiles() {
  const t = useTranslations("CategoryTiles")
  const tCategories = useTranslations("Categories")

  return (
    <section className={styles.section} aria-label={t("sectionAriaLabel")}>
      <h2 className={styles.heading}>{t("heading")}</h2>
      <ul className={styles.grid}>
        {CATEGORIES.map((category) => {
          const thumbnail = getCategoryThumbnail(category.slug)

          return (
            <li key={category.slug}>
              <Link href={`/catalog/${category.slug}`} className={styles.tile}>
                {thumbnail && (
                  <Image
                    src={`/images/gallery/${thumbnail.file}`}
                    alt=""
                    fill
                    sizes="(max-width: 820px) 50vw, 25vw"
                    className={styles.image}
                  />
                )}
                <span className={styles.label}>
                  {category.slug === POPULAR_CATEGORY && (
                    <span className={styles.badge}>{t("popularBadge")}</span>
                  )}
                  <span className={styles.title}>{tCategories(`${category.slug}.title`)}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
