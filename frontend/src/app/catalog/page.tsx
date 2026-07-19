import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import CatalogGrid from "@/components/CatalogGrid/CatalogGrid";
import CatalogFilters from "@/components/CatalogFilters/CatalogFilters";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./page.module.css";

export default function CatalogPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Breadcrumb />
          <div className={styles.layout}>
            <div className={styles.content}>
              <CatalogGrid />
              <Pagination />
            </div>
            <CatalogFilters />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
