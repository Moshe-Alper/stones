import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="פתיחה">
      <div className={styles.imageLayer}>
        {/* TODO: replace with client-provided photography */}
        <Image
          className={styles.image}
          src="/images/hero-workshop.webp"
          alt=""
          fill
          sizes="100vw"
          preload
        />
      </div>
      <div className={styles.gradient} />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>כיבוד זיכרון יקיריכם בכבוד ובעדינות</h1>
          <p className={styles.subheading}>
            אנו מתמחים ביצירת מצבות המשלבות אומנות מסורתית עם עיצוב
            מודרני, תוך שמירה על רמה גבוהה של איכות ועמידות לדורות.
          </p>
          <div className={styles.ctas}>
            <Link href="/catalog" className={styles.buttonPrimary}>
              לצפייה בקטלוג
            </Link>
            <Link href="#faq" className={styles.buttonSecondary}>
              שאלות נפוצות
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
