import styles from "./RenovationGallery.module.css";

// TODO: replace with real before/after photography from client
const PLACEHOLDERS = [1, 2, 3];

export default function RenovationGallery() {
  return (
    <section className={styles.section} aria-label="לפני ואחרי">
      <h2 className={styles.heading}>לפני ואחרי</h2>
      <p className={styles.intro}>
        בקרוב נציג כאן דוגמאות אמיתיות משיקומים שביצענו.
      </p>
      <div className={styles.grid}>
        {PLACEHOLDERS.map((id) => (
          <div className={styles.pair} key={id}>
            <div className={styles.placeholder}>
              <span>לפני</span>
            </div>
            <div className={styles.placeholder}>
              <span>אחרי</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
