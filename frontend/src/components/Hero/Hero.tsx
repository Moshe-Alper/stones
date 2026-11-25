import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import styles from "./Hero.module.css"

export default function Hero() {
  const t = useTranslations("Hero")

  return (
    <section className={styles.hero} aria-label={t("ariaLabel")}>
      <Image
        className={styles.image}
        src="/images/gallery/gallery-88.jpg"
        alt={t("imageAlt")}
        fill
        sizes="100vw"
        preload
      />
      <div className={styles.gradient} />
      <div className={styles.container}>
        <h1 className={styles.heading}>{t("heading")}</h1>
        <div className={styles.ctas}>
          <Link href="#works" className={styles.buttonPrimary}>
            {t("ctaWorks")}
          </Link>
          <Link href="/contact" className={styles.buttonSecondary}>
            {t("ctaContact")}
          </Link>
        </div>
      </div>
    </section>
  )
}
