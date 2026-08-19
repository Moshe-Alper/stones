import styles from "./ContactHero.module.css"

export default function ContactHero() {
  return (
    <section className={styles.hero} aria-labelledby="contact-heading">
      <h1 id="contact-heading" className={styles.heading}>
        ייעוץ אישי ומקצועי
      </h1>
      <span className={styles.divider} aria-hidden="true" />
      <p className={styles.subtitle}>
        אנו כאן כדי ללוות אתכם ברגעים הרגישים ביותר, במקצועיות, רגישות
        והקפדה על כל פרט ופרט.
      </p>
    </section>
  )
}
