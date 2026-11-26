import { getTranslations } from "next-intl/server"
import Header from "@/components/Header/Header"
import Footer from "@/components/Footer/Footer"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb"
import CategoryGallery from "@/components/CategoryGallery/CategoryGallery"
import CategoryTiles from "@/components/CategoryTiles/CategoryTiles"
import ContactBand from "@/components/ContactBand/ContactBand"
import { CATEGORIES } from "@/data/categories"
import styles from "./page.module.css"

type CategorySection = { title: string; text: string }

export default async function CatalogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const category = CATEGORIES.find((item) => item.slug === slug)
  const t = await getTranslations({ locale, namespace: "CatalogCategoryPage" })
  const tCategories = await getTranslations({ locale, namespace: "Categories" })
  const tBreadcrumb = await getTranslations({ locale, namespace: "Breadcrumb" })
  const title = category ? tCategories(`${category.slug}.title`) : t("fallbackTitle")
  // Short "about this stone" blocks shown under the gallery (.plan/022).
  const sections: CategorySection[] = category ? tCategories.raw(`${category.slug}.sections`) : []

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <div className={styles.container}>
          <Breadcrumb
            items={[
              { label: tBreadcrumb("homeLabel"), href: "/" },
              { label: tBreadcrumb("defaultCatalogLabel"), href: "/catalog" },
              { label: title },
            ]}
          />
          <div className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            {category && (
              <p className={styles.description}>{tCategories(`${category.slug}.description`)}</p>
            )}
          </div>
          {category ? (
            <CategoryGallery category={category.slug} categoryTitle={title} />
          ) : (
            <p className={styles.note}>{t("notFoundNote")}</p>
          )}
          {sections.length > 0 && (
            <dl className={styles.sections}>
              {sections.map((section) => (
                <div className={styles.section} key={section.title}>
                  <dt className={styles.sectionTitle}>{section.title}</dt>
                  <dd className={styles.sectionText}>{section.text}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <CategoryTiles heading={t("otherCategoriesHeading")} excludeSlug={category?.slug} />
        <ContactBand />
      </main>
      <Footer />
    </>
  )
}
