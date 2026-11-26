import { useTranslations } from "next-intl"
import Header from "@/components/Header/Header"
import Footer from "@/components/Footer/Footer"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb"
import CategoryTiles from "@/components/CategoryTiles/CategoryTiles"
import ContactBand from "@/components/ContactBand/ContactBand"
import styles from "./page.module.css"

// The catalog is a fixed set of 4 categories shown as large photo tiles — the same
// tiles as the homepage, sized up (.plan/021). No pagination, no filter sidebar.
export default function CatalogPage() {
  const t = useTranslations("CatalogPage")

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <div className={styles.topNav}>
          <Breadcrumb />
        </div>
        <CategoryTiles size="large" headingLevel={1} heading={t("title")} subtitle={t("subtitle")} />
        <ContactBand />
      </main>
      <Footer />
    </>
  )
}
