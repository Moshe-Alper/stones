import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./Hero.module.css";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className={styles.hero} aria-label={t("ariaLabel")}>
      <div className={styles.imageLayer}>
        {/* TODO: replace with client-provided photography */}
        <Image
          className={styles.image}
          src="/images/hero-workshop.webp"
          alt=""
          fill
          sizes="100vw"
          preload
        />
      </div>
      <div className={styles.gradient} />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>{t("heading")}</h1>
          <p className={styles.subheading}>{t("subheading")}</p>
          <div className={styles.ctas}>
            <Link href="/catalog" className={styles.buttonPrimary}>
              {t("ctaCatalog")}
            </Link>
            <Link href="#faq" className={styles.buttonSecondary}>
              {t("ctaFaq")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
