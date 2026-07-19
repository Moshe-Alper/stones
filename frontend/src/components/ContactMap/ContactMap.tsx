import { CONTACT_DETAILS } from "@/data/contact"
import styles from "./ContactMap.module.css"

export default function ContactMap() {
  return (
    <section className={styles.visuals} aria-label="מיקום הסטודיו">
      <div className={styles.mapPlaceholder}>
        <div
          className={styles.mapArtwork}
          role="img"
          aria-label="מפת מיקום הסטודיו בחולון"
        >
          <span className={styles.mapPin} aria-hidden="true">
            <span />
          </span>
        </div>
        <div className={styles.overlay}>
          <div>
            <strong>{CONTACT_DETAILS.studioLabel}</strong>
            <span>{CONTACT_DETAILS.hours}</span>
          </div>
          <a
            href={CONTACT_DETAILS.mapsUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="ניווט לסטודיו במפות Google"
          >
            ניווט
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div
        className={styles.workshopPlaceholder}
        role="img"
        aria-label="תמונת אווירה של בית המלאכה"
      >
        <span>בית המלאכה המשפחתי</span>
      </div>
    </section>
  )
}
