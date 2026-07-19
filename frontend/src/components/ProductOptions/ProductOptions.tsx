import styles from "./ProductOptions.module.css";
import type { Product } from "@/data/products";

// Small inline symbol glyphs (visual-only, decorative).
function SymbolIcon({ id }: { id: string }) {
  switch (id) {
    case "olive":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path
            d="M8 15C8 9 4 6 1 5c2 4 4 6 7 7Zm0 0c0-6 4-9 7-10-2 4-4 8-7 10Z"
            fill="currentColor"
          />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 20 16" aria-hidden="true" focusable="false">
          <path
            d="M10 3C7 1 3 1 1 2v11c2-1 6-1 9 1 3-2 7-2 9-1V2c-2-1-6-1-9 1Zm0 0v11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path
            d="M8 1l2 3.5h4L12 8l2 3.5h-4L8 15l-2-3.5H2L4 8 2 4.5h4L8 1Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
          <line
            x1="2"
            y1="10"
            x2="10"
            y2="2"
            stroke="currentColor"
            strokeWidth="1.3"
          />
          <circle
            cx="6"
            cy="6"
            r="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          />
        </svg>
      );
  }
}

// Visual-only configurator (plan Open Q2): chips, symbol buttons, and the
// engraving preview are non-interactive; controls are disabled with accessible
// state so they don't imply an ordering flow (PRD F5).
export default function ProductOptions({ product }: { product: Product }) {
  return (
    <div className={styles.options}>
      <fieldset className={styles.group} disabled>
        <legend className={styles.heading}>קטגוריית אבן</legend>
        <div className={styles.chips}>
          {product.categoryOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${styles.chip} ${option.active ? styles.chipActive : ""}`}
              aria-pressed={option.active ?? false}
              disabled
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group} disabled>
        <legend className={styles.heading}>עיטור וסמלים</legend>
        <div className={styles.symbols}>
          {product.symbolOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${styles.symbol} ${option.active ? styles.symbolActive : ""}`}
              aria-pressed={option.active ?? false}
              disabled
            >
              <span className={styles.symbolIcon} aria-hidden="true">
                <SymbolIcon id={option.id} />
              </span>
              <span className={styles.symbolLabel}>{option.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className={styles.group}>
        <label className={styles.heading} htmlFor="engraving-text">
          נוסח הכיתוב (תצוגה מקדימה)
        </label>
        <div className={styles.engraving}>
          <textarea
            id="engraving-text"
            className={styles.textarea}
            placeholder={product.engravingPlaceholder}
            rows={3}
            disabled
          />
          <div className={styles.preview} aria-label="תצוגה מקדימה של הכיתוב">
            {product.engravingPreview.map((line, index) => (
              <p className={styles.previewLine} key={index}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
