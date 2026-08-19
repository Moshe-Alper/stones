import Link from "next/link";
import styles from "./CatalogFilters.module.css";

const MATERIAL_OPTIONS = [
  { id: "filter-turkish", label: "שיש טורקי" },
  { id: "filter-hebron", label: "שיש חברוני" },
  { id: "filter-granite", label: "מצבות אבן גרניט" },
  { id: "filter-special", label: "מצבות מיוחדות" },
];

const STYLE_OPTIONS = [
  { id: "style-classic", label: "קלאסי" },
  { id: "style-modern", label: "מודרני" },
];

// Filters are visual-only / non-interactive for this task (no catalog data source
// yet). Controls use proper label/input markup and are disabled for accessibility.
export default function CatalogFilters() {
  return (
    <aside className={styles.sidebar} aria-label="סינון מצבות">
      <section className={styles.filters}>
        <h2 className={styles.heading}>סינון לפי קטגוריה</h2>

        <fieldset className={styles.group} disabled>
          <legend className={styles.groupTitle}>סוגי מצבות</legend>
          <div className={styles.options}>
            {MATERIAL_OPTIONS.map((option) => (
              <label className={styles.option} key={option.id} htmlFor={option.id}>
                <span className={styles.optionLabel}>{option.label}</span>
                <input
                  id={option.id}
                  className={styles.checkbox}
                  type="checkbox"
                  name="material"
                  value={option.id}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <hr className={styles.separator} />

        <fieldset className={styles.group} disabled>
          <legend className={styles.groupTitle}>סגנון עיצובי</legend>
          <div className={styles.options}>
            {STYLE_OPTIONS.map((option) => (
              <label className={styles.option} key={option.id} htmlFor={option.id}>
                <span className={styles.optionLabel}>{option.label}</span>
                <input
                  id={option.id}
                  className={styles.checkbox}
                  type="checkbox"
                  name="style"
                  value={option.id}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <hr className={styles.separator} />

        <div className={styles.group}>
          <span className={styles.groupTitle}>טווח מחירים</span>
          {/* Static slider — non-interactive for this task. */}
          <input
            className={styles.slider}
            type="range"
            min={3000}
            max={50000}
            defaultValue={50000}
            aria-label="טווח מחירים"
            disabled
          />
          <div className={styles.priceLabels}>
            <span>₪3,000</span>
            <span>₪50,000</span>
          </div>
        </div>
      </section>

      <div className={styles.ctaBox}>
        <p className={styles.ctaText}>כאן בשבילכם בכל שלב בתהליך.</p>
        <Link href="/contact" className={styles.ctaButton}>
          ייעוץ אישי מהלב
        </Link>
      </div>
    </aside>
  );
}
