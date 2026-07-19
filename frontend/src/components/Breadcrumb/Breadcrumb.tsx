import Link from "next/link";
import styles from "./Breadcrumb.module.css";

export type BreadcrumbItem = {
  label: string;
  // No href => rendered as the current (non-link) page.
  href?: string;
};

// Default trail keeps the Catalog page's original 2-level breadcrumb working.
const DEFAULT_ITEMS: BreadcrumbItem[] = [
  { label: "קטלוג מצבות" },
  { label: "בית", href: "/" },
];

export default function Breadcrumb({
  items = DEFAULT_ITEMS,
}: {
  items?: BreadcrumbItem[];
}) {
  return (
    <nav className={styles.breadcrumb} aria-label="נתיב ניווט">
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li className={styles.group} key={`${item.label}-${index}`}>
            {index > 0 && (
              <span className={styles.separator} aria-hidden="true">
                ›
              </span>
            )}
            {item.href ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
