import { notFound } from "next/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ProductGallery from "@/components/ProductGallery/ProductGallery";
import ProductOptions from "@/components/ProductOptions/ProductOptions";
import ProductPricing from "@/components/ProductPricing/ProductPricing";
import TechnicalDetails from "@/components/TechnicalDetails/TechnicalDetails";
import RelatedProducts from "@/components/RelatedProducts/RelatedProducts";
import { getProduct } from "@/data/products";
import styles from "./page.module.css";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <Breadcrumb
            items={[
              { label: product.name },
              { label: product.categoryLabel, href: product.categoryHref },
              { label: "קטלוג מצבות", href: "/catalog" },
            ]}
          />

          <div className={styles.layout}>
            <div className={styles.gallery}>
              <ProductGallery
                photos={product.photos}
                productName={product.name}
              />
            </div>
            <div className={styles.details}>
              <header className={styles.intro}>
                <h1 className={styles.title}>{product.name}</h1>
                <p className={styles.description}>{product.description}</p>
              </header>
              <ProductOptions product={product} />
              <ProductPricing product={product} />
            </div>
          </div>

          <TechnicalDetails specGroups={product.specGroups} />

          <div className={styles.divider} aria-hidden="true" />

          <RelatedProducts items={product.related} />
        </div>
      </main>
      <Footer />
    </>
  );
}
