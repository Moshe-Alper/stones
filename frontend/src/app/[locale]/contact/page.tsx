import { useTranslations } from "next-intl"
import Header from "@/components/Header/Header"
import Footer from "@/components/Footer/Footer"
import ContactHero from "@/components/ContactHero/ContactHero"
import ContactForm from "@/components/ContactForm/ContactForm"
import ContactDetails from "@/components/ContactDetails/ContactDetails"
import ContactMap from "@/components/ContactMap/ContactMap"
import TrustHighlights from "@/components/TrustHighlights/TrustHighlights"
import FAQ from "@/components/FAQ/FAQ"
import styles from "./page.module.css"

export default function ContactPage() {
  const t = useTranslations("ContactPage")

  return (
    <>
      <Header />
      <main className={styles.main}>
        <ContactHero />
        <section className={styles.grid} aria-label={t("gridAriaLabel")}>
          <div className={styles.contactColumn}>
            <ContactForm />
            <ContactDetails />
          </div>
          <div className={styles.mapColumn}>
            <ContactMap />
          </div>
        </section>
        <TrustHighlights />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
