import { useTranslations } from "next-intl";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import BackLink from "@/components/BackLink/BackLink";
import CatalogGrid from "@/components/CatalogGrid/CatalogGrid";
import CatalogFilters from "@/components/CatalogFilters/CatalogFilters";
import styles from "./page.module.css";

// No <Pagination /> here: the catalog is a fixed set of 4 categories, so there
// will never be a second page — see .plan/013-2026-08-21-catalog-page-fixes.md.
export default function CatalogPage() {
  const t = useTranslations("Breadcrumb");

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.topNav}>
            <BackLink href="/" label={t("backToHome")} />
            <Breadcrumb />
          </div>
          <div className={styles.layout}>
            <div className={styles.content}>
              <CatalogGrid />
            </div>
            <CatalogFilters />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
