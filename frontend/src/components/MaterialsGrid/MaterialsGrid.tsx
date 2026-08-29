import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./MaterialsGrid.module.css";
import { getCategoryThumbnail } from "@/data/gallery";

const hebronThumbnail = getCategoryThumbnail("hebron-marble");

export default function MaterialsGrid() {
  const t = useTranslations("MaterialsGrid");

  const MATERIALS = [
    {
      id: "hebron-marble",
      title: t("hebronMarbleTitle"),
      image: hebronThumbnail
        ? `/images/gallery/${hebronThumbnail.file}`
        : "/images/material-marble.webp",
      width: 2040,
      height: 1536,
    },
    {
      id: "granite",
      title: t("granitePremiumTitle"),
      image: "/images/material-granite.webp",
      width: 1200,
      height: 800,
    },
    {
      id: "basalt",
      title: t("basaltTitle"),
      image: "/images/material-basalt.webp",
      width: 1200,
      height: 798,
    },
  ];

  return (
    <section className={styles.section} aria-label={t("sectionAriaLabel")}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{t("heading")}</h2>
        <div className={styles.divider} />
      </div>
      <div className={styles.grid}>
        {MATERIALS.map((material) => (
          <article className={styles.card} key={material.id}>
            {/* TODO: replace with client-provided photography */}
            <Image
              className={styles.cardImage}
              src={material.image}
              alt={material.title}
              width={material.width}
              height={material.height}
              sizes="(max-width: 900px) 100vw, 33vw"
            />
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{material.title}</h3>
              <p className={styles.cardExcerpt}>{t("excerpt")}</p>
              <Link href="/catalog" className={styles.cardLink}>
                {t("viewAll")}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
