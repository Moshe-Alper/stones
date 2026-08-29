import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import CategoryGallery from "@/components/CategoryGallery/CategoryGallery";
import { CATEGORIES } from "@/components/CatalogGrid/categories";
import styles from "./page.module.css";

export default async function CatalogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const category = CATEGORIES.find((item) => item.slug === slug);
  const t = await getTranslations({ locale, namespace: "CatalogCategoryPage" });
  const tCategories = await getTranslations({ locale, namespace: "Categories" });
  const tBreadcrumb = await getTranslations({ locale, namespace: "Breadcrumb" });
  const title = category ? tCategories(`${category.slug}.title`) : t("fallbackTitle");

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Breadcrumb
            items={[
              { label: title },
              { label: tBreadcrumb("defaultCatalogLabel"), href: "/catalog" },
              { label: tBreadcrumb("homeLabel"), href: "/" },
            ]}
          />
          <h1 className={styles.title}>{title}</h1>
          {category && (
            <p className={styles.description}>
              {tCategories(`${category.slug}.description`)}
            </p>
          )}
          {category ? (
            <CategoryGallery category={category.slug} categoryTitle={title} />
          ) : (
            <p className={styles.note}>{t("notFoundNote")}</p>
          )}
          <Link href="/contact" className={styles.cta}>
            {t("ctaConsult")}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
