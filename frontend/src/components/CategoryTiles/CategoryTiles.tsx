import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { CATEGORIES, type CategorySlug } from "@/data/categories"
import { getCategoryPhotoCount, getCategoryThumbnail } from "@/data/gallery"
import styles from "./CategoryTiles.module.css"

type CategoryTilesProps = {
  /** "large" = the catalog page: 2×2 tiles with a photo count. */
  size?: "default" | "large"
  /** The catalog page uses the tiles as its main content, so it renders an h1. */
  headingLevel?: 1 | 2
  /** Overrides the default "Choose a stone" heading. */
  heading?: string
  subtitle?: string
  /** Leaves one category out (the "more stone types" strip on a category page). */
  excludeSlug?: CategorySlug
}

export default function CategoryTiles({
  size = "default",
  headingLevel = 2,
  heading,
  subtitle,
  excludeSlug,
}: CategoryTilesProps) {
  const t = useTranslations("CategoryTiles")
  const tCategories = useTranslations("Categories")
  const categories = CATEGORIES.filter((category) => category.slug !== excludeSlug)
  const Heading = headingLevel === 1 ? "h1" : "h2"
  const isLarge = size === "large"

  return (
    <section
      className={isLarge ? `${styles.section} ${styles.large}` : styles.section}
      aria-label={heading ?? t("sectionAriaLabel")}
    >
      <div className={styles.header}>
        <Heading className={styles.heading}>{heading ?? t("heading")}</Heading>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <ul className={styles.grid} data-count={categories.length}>
        {categories.map((category) => {
          const thumbnail = getCategoryThumbnail(category.slug)

          return (
            <li key={category.slug}>
              <Link href={`/catalog/${category.slug}`} className={styles.tile}>
                {thumbnail && (
                  <Image
                    src={`/images/gallery/${thumbnail.file}`}
                    alt=""
                    fill
                    sizes={isLarge ? "(max-width: 820px) 100vw, 50vw" : "(max-width: 820px) 50vw, 25vw"}
                    className={styles.image}
                  />
                )}
                <span className={styles.label}>
                  {category.featured && (
                    <span className={styles.badge}>{t("popularBadge")}</span>
                  )}
                  <span className={styles.title}>{tCategories(`${category.slug}.title`)}</span>
                  {isLarge && (
                    <span className={styles.count}>
                      {t("photoCount", { count: getCategoryPhotoCount(category.slug) })}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
