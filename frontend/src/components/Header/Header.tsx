import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./Header.module.css";

export default function Header() {
  const t = useTranslations("Header");

  const NAV_LINKS = [
    { href: "/catalog", label: t("navCatalog") },
    { href: "/#faq", label: t("navFaq") },
  ];

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label={t("navAriaLabel")}>
        <Link href="/" className={styles.brand} aria-label={t("brandAriaLabel")}>
          <span className={styles.brandMark} aria-hidden="true" />
          {t("brand")}
        </Link>
        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.link}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <LanguageSwitcher />
          <Link href="/contact" className={styles.ctaButton}>
            {t("ctaContact")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
