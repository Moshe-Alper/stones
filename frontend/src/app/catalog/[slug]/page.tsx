import Link from "next/link";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import CategoryGallery from "@/components/CategoryGallery/CategoryGallery";
import { CATEGORIES } from "@/components/CatalogGrid/categories";
import styles from "./page.module.css";

export default async function CatalogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORIES.find((item) => item.slug === slug);
  const title = category?.title ?? "גלריית דגמים";

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Breadcrumb
            items={[
              { label: title },
              { label: "קטלוג מצבות", href: "/catalog" },
              { label: "בית", href: "/" },
            ]}
          />
          <h1 className={styles.title}>{title}</h1>
          {category?.description && (
            <p className={styles.description}>{category.description}</p>
          )}
          {category ? (
            <CategoryGallery category={category.slug} categoryTitle={title} />
          ) : (
            <p className={styles.note}>הקטגוריה לא נמצאה.</p>
          )}
          <Link href="/contact" className={styles.cta}>
            בקשת ייעוץ
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
