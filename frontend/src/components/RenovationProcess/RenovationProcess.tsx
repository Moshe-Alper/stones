import styles from "./RenovationProcess.module.css";

const STEPS = [
  {
    number: "01",
    title: "אבחון בשטח",
    desc: "ביקור בבית העלמין להערכת מצב האבן, היסודות והכיתוב וקביעת היקף העבודה הנדרש.",
  },
  {
    number: "02",
    title: "ניקוי וחיטוי",
    desc: "הסרת כתמי לחות, טחב ואבנית בשיטות מקצועיות שאינן פוגעות באבן המקורית.",
  },
  {
    number: "03",
    title: "יישור וחיזוק",
    desc: "תיקון יסודות, יישור המצבה וסגירת סדקים במקרה הצורך.",
  },
  {
    number: "04",
    title: "שיקום כיתוב וגימור",
    desc: "חידוש צבע האותיות, וציפוי מגן למניעת נזק חוזר בעתיד.",
  },
];

export default function RenovationProcess() {
  return (
    <section className={styles.section} aria-label="תהליך השיקום">
      <div className={styles.inner}>
        <div className={styles.headingCol}>
          <h2 className={styles.heading}>תהליך השיקום</h2>
          <p className={styles.intro}>
            כל שיקום מתחיל בביקור ואבחון אישי בשטח, כדי שנוכל להתאים את
            הטיפול הנכון למצב הספציפי של המצבה.
          </p>
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
