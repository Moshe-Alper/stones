import Link from "next/link";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { href: "/catalog", label: "קטלוג" },
  { href: "/renovation", label: "שיקום מצבות" },
  { href: "/#faq", label: "שאלות נפוצות" },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="ניווט ראשי">
        <Link href="/" className={styles.brand} aria-label="שיש אלפר, לעמוד הבית">
          <span className={styles.brandMark} aria-hidden="true" />
          שיש אלפר
        </Link>
        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className={styles.link}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          {/* Visual-only language switcher — not functional (out of scope). */}
          <button
            type="button"
            className={styles.langSwitcher}
            aria-label="בחירת שפה"
            disabled
          >
            RU | EN | עברית
          </button>
          <Link href="/contact" className={styles.ctaButton}>
            צור קשר
          </Link>
        </div>
      </nav>
    </header>
  );
}
