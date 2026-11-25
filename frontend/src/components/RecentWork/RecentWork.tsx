import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { getFeaturedPhotos } from "@/data/gallery"
import styles from "./RecentWork.module.css"

export default function RecentWork() {
  const t = useTranslations("RecentWork")
  const tCategories = useTranslations("Categories")
  const photos = getFeaturedPhotos()

  return (
    <section id="works" className={styles.section} aria-label={t("sectionAriaLabel")}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{t("heading")}</h2>
        <Link href="/catalog" className={styles.viewAll}>
          {t("viewAll")} ←
        </Link>
      </div>
      <ul className={styles.grid}>
        {photos.map((photo) => (
          <li className={styles.tile} key={photo.file}>
            <Link href={`/catalog/${photo.category}`} className={styles.tileLink}>
              <Image
                src={`/images/gallery/${photo.file}`}
                alt={t("photoAlt", { category: tCategories(`${photo.category}.title`) })}
                fill
                sizes="(max-width: 820px) 50vw, 25vw"
                className={styles.image}
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
