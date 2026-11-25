"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { CONTACT_DETAILS } from "@/data/contact"
import styles from "./ContactMap.module.css"

export default function ContactMap() {
  const t = useTranslations("ContactMap")
  const [mapActive, setMapActive] = useState(false)
  const [mapFailed, setMapFailed] = useState(false)

  return (
    <section className={styles.visuals} aria-label={t("sectionAriaLabel")}>
      <div className={styles.mapPlaceholder}>
        {mapFailed ? (
          <div
            className={styles.mapFallback}
            role="img"
            aria-label={t("mapFallbackAriaLabel")}
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
              title={t("mapTitle")}
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
                <span>{t("activateMapLabel")}</span>
              </button>
            )}
          </>
        )}
        <div className={styles.overlay}>
          <div className={styles.overlayInfo}>
            <strong>{t("studioLabel")}</strong>
            <span>{t("hours")}</span>
          </div>
          <div className={styles.navLinks}>
            <a
              href={CONTACT_DETAILS.mapsUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t("navigateAriaLabel")}
            >
              {t("navigateLabel")}
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href={CONTACT_DETAILS.wazeUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={t("wazeAriaLabel")}
            >
              {t("wazeLabel")}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
