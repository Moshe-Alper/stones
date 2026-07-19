import Link from "next/link";
import styles from "./ProductPricing.module.css";
import type { Product } from "@/data/products";

function formatPrice(value: number): string {
  return `₪${value.toLocaleString("en-US")}`;
}

// Price is an approximate range, never final online pricing (PRD F5).
// The save button is inert (visual-only); the primary CTA links to /contact.
export default function ProductPricing({ product }: { product: Product }) {
  const { min, max } = product.price;

  return (
    <div className={styles.pricing}>
      <div className={styles.summary}>
        <p className={styles.note}>{product.priceNote}</p>
        <div className={styles.priceBlock}>
          <span className={styles.priceLabel}>{product.priceLabel}</span>
          <span className={styles.priceRange}>
            {formatPrice(min)} - {formatPrice(max)}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.saveButton}
          aria-label="שמירת הדגם"
          disabled
        >
          <svg
            className={styles.saveIcon}
            viewBox="0 0 16 18"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M3 1h10v16l-5-3.5L3 17V1Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
        <Link href="/contact" className={styles.cta}>
          בקשת הצעת מחיר
        </Link>
      </div>

      <p className={styles.reassurance}>
        <svg
          className={styles.reassuranceIcon}
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M10 18C4 15 2 11 2 6l8-4 8 4c0 5-2 9-8 12Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M6.5 9.5l2.5 2.5 4.5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
        <span>{product.reassurance}</span>
      </p>
    </div>
  );
}
