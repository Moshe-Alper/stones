import styles from "./Pagination.module.css";

const PAGES = [1, 2];
const CURRENT_PAGE = 1;

// Non-navigating for this task (no catalog data source yet). Buttons are disabled
// affordances that mirror the visual-only filters.
export default function Pagination() {
  return (
    <nav className={styles.pagination} aria-label="עימוד">
      <button
        type="button"
        className={styles.control}
        aria-label="הקודם"
        disabled
      >
        <span aria-hidden="true">‹</span>
      </button>
      {PAGES.map((page) => {
        const isActive = page === CURRENT_PAGE;
        return (
          <button
            key={page}
            type="button"
            className={
              isActive ? `${styles.page} ${styles.pageActive}` : styles.page
            }
            aria-label={`עמוד ${page}`}
            aria-current={isActive ? "page" : undefined}
            disabled
          >
            {page}
          </button>
        );
      })}
    </nav>
  );
}
