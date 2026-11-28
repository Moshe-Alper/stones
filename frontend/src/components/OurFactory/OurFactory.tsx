import Image from "next/image"
import { useTranslations } from "next-intl"
import PhotoPlaceholder from "@/components/PhotoPlaceholder/PhotoPlaceholder"
import { FACTORY_PHOTOS, getFactoryPhotoSrc, type FactoryPhoto } from "@/data/factory-photos"
import styles from "./OurFactory.module.css"

// Shows the real working factory in Pardes Hana (vehicles, machines, finished stones).
// `photos` lets a page show a subset (the about page shows only real photos, .plan/025).
export default function OurFactory({ photos = FACTORY_PHOTOS }: { photos?: FactoryPhoto[] }) {
  const t = useTranslations("OurFactory")

  return (
    <section className={styles.section} aria-labelledby="our-factory-heading">
      <div className={styles.header}>
        <h2 id="our-factory-heading" className={styles.heading}>
          {t("heading")}
        </h2>
        <p className={styles.subheading}>{t("subheading")}</p>
      </div>
      <ul className={styles.grid}>
        {photos.map((photo) => {
          const src = getFactoryPhotoSrc(photo)
          const caption = t(`photos.${photo.id}`)
          return (
            <li className={styles.tile} key={photo.id}>
              {src ? (
                <Image
                  src={src}
                  alt={caption}
                  fill
                  sizes="(max-width: 820px) 50vw, 33vw"
                  className={styles.image}
                />
              ) : (
                <PhotoPlaceholder caption={caption} />
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
