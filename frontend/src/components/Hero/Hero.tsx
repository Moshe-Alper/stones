import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="פתיחה">
      <div className={styles.imageLayer}>
        {/* TODO: replace with client-provided photography */}
        <img
          className={styles.image}
          src="https://placehold.co/1600x900/d8d3c4/44403a?text=Alper+Marble"
          alt=""
        />
      </div>
      <div className={styles.gradient} />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>כיבוד זיכרון יקיריכם בכבוד ובעדינות</h1>
          <p className={styles.subheading}>
            אנו מתמחים ביצירת מצבות ואתרי הנצחה המשלבים אומנות מסורתית עם עיצוב
            מודרני, תוך שמירה על רמה גבוהה של איכות ועמידות לדורות.
          </p>
          <div className={styles.ctas}>
            <Link href="/catalog" className={styles.buttonPrimary}>
              לצפייה בקטלוג
            </Link>
            <Link href="#brand-story" className={styles.buttonSecondary}>
              סיפור המותג
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
