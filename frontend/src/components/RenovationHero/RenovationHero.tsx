import styles from "./RenovationHero.module.css";

export default function RenovationHero() {
  return (
    <section className={styles.hero} aria-labelledby="renovation-heading">
      <h1 id="renovation-heading" className={styles.heading}>
        שיקום והחייאת מצבות קיימות
      </h1>
      <span className={styles.divider} aria-hidden="true" />
      <p className={styles.subtitle}>
        לחות, טחב, שקיעה ודהיית הכיתוב הם תהליכים טבעיים לאורך השנים. אנו
        מעניקים למצבה הקיימת טיפול מקצועי ורגיש שמחזיר אותה למצבה המכובד.
      </p>
    </section>
  );
}
