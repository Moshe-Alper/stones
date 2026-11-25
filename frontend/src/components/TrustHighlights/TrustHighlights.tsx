import { useTranslations } from "next-intl"
import styles from "./TrustHighlights.module.css"

const ICONS = ["design", "visibility", "shield"] as const

function HighlightIcon({ icon }: { icon: (typeof ICONS)[number] }) {
  if (icon === "design") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="m6 25 3-7L23 4l5 5-14 14-8 2Z" />
        <path d="m20 7 5 5M9 18l5 5M5 28h22" />
      </svg>
    )
  }

  if (icon === "visibility") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M3 16s5-8 13-8 13 8 13 8-5 8-13 8S3 16 3 16Z" />
        <circle cx="16" cy="16" r="4" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M16 29C7 25 5 19 5 9l11-5 11 5c0 10-2 16-11 20Z" />
      <path d="m10 16 4 4 8-9" />
    </svg>
  )
}

export default function TrustHighlights() {
  const t = useTranslations("TrustHighlights")

  const HIGHLIGHTS = [
    { title: t("highlight1Title"), icon: ICONS[0] },
    { title: t("highlight2Title"), icon: ICONS[1] },
    { title: t("highlight3Title"), icon: ICONS[2] },
  ]

  return (
    <section className={styles.section} aria-label={t("sectionAriaLabel")}>
      <div className={styles.container}>
        {HIGHLIGHTS.map((highlight) => (
          <article className={styles.highlight} key={highlight.title}>
            <span className={styles.icon}>
              <HighlightIcon icon={highlight.icon} />
            </span>
            <h2>{highlight.title}</h2>
          </article>
        ))}
      </div>
    </section>
  )
}
