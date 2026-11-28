import Image from "next/image"
import { useTranslations } from "next-intl"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb"
import OurFactory from "@/components/OurFactory/OurFactory"
import {
  ABOUT_CRAFT_PHOTO_ID,
  ABOUT_STORY_PHOTO_ID,
  FACTORY_PHOTOS,
  getFactoryPhoto,
  getFactoryPhotoSrc,
} from "@/data/factory-photos"
import styles from "./AboutContent.module.css"

// The factory strip only appears once it has this many real photos beyond the two
// already shown above it, so the about page never shows placeholders (.plan/025 Q4).
const MIN_STRIP_PHOTOS = 3

// Family story, craft and factory for the about page (.plan/025).
export default function AboutContent() {
  const t = useTranslations("AboutPage")
  const tBreadcrumb = useTranslations("Breadcrumb")
  const storyParagraphs: string[] = t.raw("storyParagraphs")

  const storyPhoto = getFactoryPhoto(ABOUT_STORY_PHOTO_ID)
  const craftPhoto = getFactoryPhoto(ABOUT_CRAFT_PHOTO_ID)
  const storySrc = storyPhoto ? getFactoryPhotoSrc(storyPhoto) : null
  const craftSrc = craftPhoto ? getFactoryPhotoSrc(craftPhoto) : null
  const stripPhotos = FACTORY_PHOTOS.filter(
    (photo) => photo.file && photo.id !== ABOUT_STORY_PHOTO_ID && photo.id !== ABOUT_CRAFT_PHOTO_ID,
  )

  return (
    <>
      <div className={styles.container}>
        <div className={styles.intro}>
          <Breadcrumb items={[{ label: tBreadcrumb("homeLabel"), href: "/" }, { label: t("title") }]} />
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.lead}>{t("intro")}</p>
        </div>

        <section className={styles.row} aria-labelledby="about-story-heading">
          <div className={styles.text}>
            <h2 id="about-story-heading" className={styles.heading}>
              {t("storyHeading")}
            </h2>
            {storyParagraphs.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
          {storySrc && (
            <div className={styles.storyImage}>
              <Image
                src={storySrc}
                alt={t("storyImageAlt")}
                fill
                sizes="(max-width: 820px) 100vw, 560px"
                className={styles.image}
              />
            </div>
          )}
        </section>

        <section className={`${styles.row} ${styles.rowReverse}`} aria-labelledby="about-craft-heading">
          <div className={styles.text}>
            <h2 id="about-craft-heading" className={styles.heading}>
              {t("craftHeading")}
            </h2>
            <p className={styles.paragraph}>{t("craftText")}</p>
          </div>
          {craftSrc && (
            <div className={styles.craftImage}>
              <Image
                src={craftSrc}
                alt={t("craftImageAlt")}
                fill
                sizes="(max-width: 820px) 280px, 320px"
                className={styles.image}
              />
            </div>
          )}
        </section>
      </div>

      {stripPhotos.length >= MIN_STRIP_PHOTOS && <OurFactory photos={stripPhotos} />}
    </>
  )
}
