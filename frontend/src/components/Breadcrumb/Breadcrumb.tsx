import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./Breadcrumb.module.css";

export type BreadcrumbItem = {
  label: string;
  // No href => rendered as the current (non-link) page.
  href?: string;
};

export default function Breadcrumb({ items }: { items?: BreadcrumbItem[] }) {
  const t = useTranslations("Breadcrumb");

  // Default trail keeps the Catalog page's original 2-level breadcrumb working.
  const resolvedItems: BreadcrumbItem[] = items ?? [
    { label: t("defaultCatalogLabel") },
    { label: t("homeLabel"), href: "/" },
  ];

  return (
    <nav className={styles.breadcrumb} aria-label={t("navAriaLabel")}>
      <ol className={styles.list}>
        {resolvedItems.map((item, index) => (
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
