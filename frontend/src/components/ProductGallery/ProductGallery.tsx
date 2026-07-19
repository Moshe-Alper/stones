import styles from "./ProductGallery.module.css";
import type { ProductPhoto } from "@/data/products";

// Visual-only gallery: main image + inert zoom button + 4-thumbnail strip.
// Thumbnail switching and zoom/lightbox are deferred (see plan Open Q2).
export default function ProductGallery({
  photos,
  productName,
}: {
  photos: ProductPhoto[];
  productName: string;
}) {
  const [main, ...thumbnails] = photos;

  return (
    <section className={styles.gallery} aria-label="גלריית תמונות">
      <div className={styles.mainFrame}>
        {/* TODO: replace with client-provided photography */}
        <div
          className={styles.mainImage}
          role="img"
          aria-label={main?.alt ?? productName}
        >
          <span className={styles.placeholderMark} aria-hidden="true">
            +
          </span>
        </div>
        <button
          type="button"
          className={styles.zoomButton}
          aria-label="הגדלת התמונה"
          disabled
        >
          <svg
            className={styles.zoomIcon}
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
          >
            <circle
              cx="7"
              cy="7"
              r="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line
              x1="10.8"
              y1="10.8"
              x2="15"
              y2="15"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      <ul className={styles.thumbnails} aria-label="תמונות נוספות">
        {thumbnails.map((photo, index) => (
          <li
            key={photo.id}
            className={`${styles.thumb} ${index === 0 ? styles.active : ""}`}
          >
            {/* TODO: replace with client-provided photography */}
            <div
              className={styles.thumbImage}
              role="img"
              aria-label={photo.alt}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
