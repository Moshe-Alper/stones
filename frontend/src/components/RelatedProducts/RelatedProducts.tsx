import Link from "next/link";
import styles from "./RelatedProducts.module.css";
import type { RelatedProduct } from "@/data/products";

// Related memorial options from other categories. Each card links to its
// category gallery; the section header links to the full catalog.
export default function RelatedProducts({
  items,
}: {
  items: RelatedProduct[];
}) {
  return (
    <section
      className={styles.section}
      aria-label="אפשרויות הנצחה מקטגוריות נוספות"
    >
      <div className={styles.header}>
        <h2 className={styles.heading}>אפשרויות הנצחה מקטגוריות נוספות</h2>
        <Link href="/catalog" className={styles.catalogLink}>
          לכל הקטלוג
        </Link>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <article className={styles.card} key={item.id}>
            <Link href={item.href} className={styles.cardLink}>
              {/* TODO: replace with client-provided photography */}
              <div
                className={styles.cardImage}
                role="img"
                aria-label={item.title}
              >
                <span className={styles.placeholderMark} aria-hidden="true">
                  +
                </span>
              </div>
              <h4 className={styles.cardTitle}>{item.title}</h4>
              <p className={styles.cardCategory}>{item.categoryLabel}</p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
