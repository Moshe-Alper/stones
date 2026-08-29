import { useTranslations } from "next-intl";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import RenovationHero from "@/components/RenovationHero/RenovationHero";
import RenovationProblems from "@/components/RenovationProblems/RenovationProblems";
import RenovationProcess from "@/components/RenovationProcess/RenovationProcess";
import RenovationGallery from "@/components/RenovationGallery/RenovationGallery";
import ContactForm from "@/components/ContactForm/ContactForm";
import styles from "./page.module.css";

export default function RenovationPage() {
  const t = useTranslations("RenovationPage");

  return (
    <>
      <Header />
      <main>
        <RenovationHero />
        <RenovationProblems />
        <RenovationProcess />
        <RenovationGallery />
        <section className={styles.requestSection} aria-label={t("requestSectionAriaLabel")}>
          <div className={styles.requestInner}>
            <h2 className={styles.requestHeading}>{t("requestHeading")}</h2>
            <p className={styles.requestIntro}>{t("requestIntro")}</p>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
