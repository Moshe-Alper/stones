import Link from "next/link";
import styles from "./ProcessSteps.module.css";

const STEPS = [
  {
    number: "01",
    title: "פגישת ייעוץ",
    desc: "הצוות שלנו מלווה את המשפחות באופן אישי, מרגע התכנון ועד להקמה הסופית, תוך הקפדה על הפרטים הקטנים ביותר.",
  },
  {
    number: "02",
    title: "תכנון ועיצוב",
    desc: "התאמה מדויקת של סוג האבן, הכיתוב והאלמנטים האומנותיים לפי רצון המשפחה וזכרו של הנפטר.",
  },
  {
    number: "03",
    title: "ייצור אומנותי",
    desc: "עבודה ידנית קפדנית המשלבת טכנולוגיה מודרנית עם אומנות סיתת מסורתית רבת שנים.",
  },
  {
    number: "04",
    title: "הצבה בשטח",
    desc: "הקמה מקצועית ויציבה בבתי העלמין, תוך הקפדה על גימור מושלם ועמידות לאורך זמן.",
  },
];

export default function ProcessSteps() {
  return (
    <section className={styles.section} aria-label="תהליך הליווי שלנו">
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.headingCol}>
            <h2 className={styles.heading}>תהליך הליווי שלנו</h2>
            <p className={styles.intro}>
              {'ב"שיש אלפר", אנו מבינים שכל מצבה היא סיפור חיים שלם. הצוות שלנו מלווה אתכם '}
              ברגישות ובמסירות, מרגע התכנון ועד להקמה הסופית, תוך שמירה על מסורת ארוכת שנים של
              איכות ואומנות.
            </p>
          </div>
          <Link href="/#services" className={styles.allServices}>
            כל השירותים
          </Link>
        </div>
        <ol className={styles.steps}>
          {STEPS.map((step) => (
            <li className={styles.step} key={step.number}>
              <span className={styles.stepNumber}>{step.number}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
