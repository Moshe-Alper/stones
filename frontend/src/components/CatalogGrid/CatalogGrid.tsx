import Image from "next/image";
import Link from "next/link";
import styles from "./CatalogGrid.module.css";
import { CATEGORIES } from "./categories";
import { getCategoryThumbnail } from "@/data/gallery";

const SUBTITLE =
  "מבחר מצבות משיש טורקי, חברוני, גרניט ודגמים מיוחדים בייצור אישי של אלפר מצבות.";

export default function CatalogGrid() {
  const count = CATEGORIES.length;

  return (
    <section className={styles.section} aria-label="קטלוג דגמים">
      <div className={styles.header}>
        <div className={styles.heading}>
          <h1 className={styles.title}>קטלוג דגמים</h1>
          <p className={styles.subtitle}>{SUBTITLE}</p>
        </div>
        <p className={styles.count}>מציג {count} קטגוריות נבחרות</p>
      </div>

      <div className={styles.grid}>
        {CATEGORIES.map((category) => {
          const thumbnail = getCategoryThumbnail(category.slug);

          return (
            <article className={styles.card} key={category.id}>
              <div className={styles.cardImage}>
                {thumbnail ? (
                  <Image
                    src={`/images/gallery/${thumbnail.file}`}
                    alt={category.title}
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
                <h3 className={styles.cardTitle}>{category.title}</h3>
                <p className={styles.cardDescription}>
                  {category.description}
                </p>
                <Link
                  href={`/catalog/${category.slug}`}
                  className={styles.cardLink}
                >
                  לצפייה בגלריה
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
