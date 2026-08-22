import Link from "next/link";
import styles from "./Footer.module.css";

const INFO_LINKS = ["מדיניות פרטיות", "תנאי שימוש", "נגישות", "בלוג הנצחה"];
const NAV_LINKS = [
  { label: "קטלוג מוצרים", href: "/catalog" },
  { label: "סוגי אבנים", href: "/catalog" },
  { label: "שירותי תחזוקה", href: "/renovation" },
  { label: "שאלות נפוצות", href: "/#faq" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.branding}>
          <span className={styles.brandName}>שיש אלפר</span>
          <p className={styles.brandBlurb}>
            מובילים את תרבות ההנצחה בישראל למעלה מ-50 שנה, עם דגש על איכות, רגישות ועיצוב נצחי.
          </p>
        </div>
        <div className={styles.linkColumns}>
          <div className={styles.column}>
            <span className={styles.columnTitle}>ניווט מהיר</span>
            <ul className={styles.list}>
              {NAV_LINKS.map((link) => (
                <li className={styles.listItem} key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.column}>
            <span className={styles.columnTitle}>מידע נוסף</span>
            <ul className={styles.list}>
              {INFO_LINKS.map((label) => (
                <li className={styles.listItem} key={label}>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.bottomLeft}>
          <span className={styles.meta}>נגישות AA</span>
          {/* Static placeholder text only — no real visitor tracking (out of scope). */}
          <span className={styles.meta}>מבקרים: 12,482</span>
        </div>
        <span className={styles.copyright}>© {new Date().getFullYear()} שיש אלפר. כל הזכויות שמורות.</span>
      </div>
    </footer>
  );
}
