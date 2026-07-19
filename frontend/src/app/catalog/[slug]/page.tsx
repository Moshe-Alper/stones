import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { CATEGORIES } from "@/components/CatalogGrid/categories";
import styles from "./page.module.css";

// Minimal placeholder — the full per-category gallery / Product Detail page is a
// separate backlog task. This stub keeps catalog card links from dead-ending.
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
        <h1>{title}</h1>
        <p className={styles.note}>גלריית הדגמים תתווסף בקרוב.</p>
      </main>
      <Footer />
    </>
  );
}
