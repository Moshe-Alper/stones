import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import styles from "./Footer.module.css";

export default function Footer() {
  const t = useTranslations("Footer");

  const NAV_LINKS = [
    { label: t("navCatalogProducts"), href: "/catalog" },
    { label: t("navStoneTypes"), href: "/catalog" },
    { label: t("navFaq"), href: "/contact#faq" },
  ];
  const INFO_LINKS = [
    t("infoPrivacy"),
    t("infoTerms"),
    t("infoAccessibility"),
    t("infoBlog"),
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.branding}>
          <span className={styles.brandName}>{t("brandName")}</span>
          <p className={styles.brandBlurb}>{t("brandBlurb")}</p>
        </div>
        <div className={styles.linkColumns}>
          <div className={styles.column}>
            <span className={styles.columnTitle}>{t("navHeading")}</span>
            <ul className={styles.list}>
              {NAV_LINKS.map((link) => (
                <li className={styles.listItem} key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.column}>
            <span className={styles.columnTitle}>{t("infoHeading")}</span>
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
          <span className={styles.meta}>{t("accessibilityBadge")}</span>
          {/* Static placeholder text only — no real visitor tracking (out of scope). */}
          <span className={styles.meta}>{t("visitorsPlaceholder")}</span>
        </div>
        <span className={styles.copyright}>
          {t("copyright", { year: new Date().getFullYear() })}
        </span>
      </div>
    </footer>
  );
}
