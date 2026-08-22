import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import RenovationHero from "@/components/RenovationHero/RenovationHero";
import RenovationProblems from "@/components/RenovationProblems/RenovationProblems";
import RenovationProcess from "@/components/RenovationProcess/RenovationProcess";
import RenovationGallery from "@/components/RenovationGallery/RenovationGallery";
import ContactForm from "@/components/ContactForm/ContactForm";
import styles from "./page.module.css";

export default function RenovationPage() {
  return (
    <>
      <Header />
      <main>
        <RenovationHero />
        <RenovationProblems />
        <RenovationProcess />
        <RenovationGallery />
        <section className={styles.requestSection} aria-label="בקשת הערכת מחיר">
          <div className={styles.requestInner}>
            <h2 className={styles.requestHeading}>בקשת הערכת מחיר לשיקום מצבה</h2>
            <p className={styles.requestIntro}>
              ספרו לנו על מצב המצבה ומיקומה, ונחזור אליכם עם הערכה ראשונית.
            </p>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
