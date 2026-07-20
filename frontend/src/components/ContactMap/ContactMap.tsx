"use client"

import { useState } from "react"
import { CONTACT_DETAILS } from "@/data/contact"
import styles from "./ContactMap.module.css"

export default function ContactMap() {
  const [mapActive, setMapActive] = useState(false)
  const [mapFailed, setMapFailed] = useState(false)

  return (
    <section className={styles.visuals} aria-label="מיקום הסטודיו">
      <div className={styles.mapPlaceholder}>
        {mapFailed ? (
          <div
            className={styles.mapFallback}
            role="img"
            aria-label="מפת מיקום הסטודיו"
          >
            <span>{CONTACT_DETAILS.addressLine}</span>
          </div>
        ) : (
          <>
            <iframe
              className={
                mapActive
                  ? `${styles.mapFrame} ${styles.mapFrameActive}`
                  : styles.mapFrame
              }
              src={CONTACT_DETAILS.mapsEmbedUrl}
              title="מפת מיקום הסטודיו"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onError={() => setMapFailed(true)}
            />
            {!mapActive && (
              <button
                type="button"
                className={styles.mapActivate}
                onClick={() => setMapActive(true)}
              >
                <span>הקש למפה אינטראקטיבית</span>
              </button>
            )}
          </>
        )}
        <div className={styles.overlay}>
          <div className={styles.overlayInfo}>
            <strong>{CONTACT_DETAILS.studioLabel}</strong>
            <span>{CONTACT_DETAILS.hours}</span>
          </div>
          <div className={styles.navLinks}>
            <a
              href={CONTACT_DETAILS.mapsUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="ניווט לסטודיו במפות Google"
            >
              ניווט
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href={CONTACT_DETAILS.wazeUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="ניווט לסטודיו ב-Waze"
            >
              Waze
              <span aria-hidden="true">↗</span>
            </a>
          </div>
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
