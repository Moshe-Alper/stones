import styles from "./TrustHighlights.module.css"

const HIGHLIGHTS = [
  {
    title: "עיצוב אישי",
    description: "כל אנדרטה מתוכננת יחד אתכם כדי להנציח את הסיפור האישי.",
    icon: "design",
  },
  {
    title: "שקיפות מלאה",
    description: "עדכונים שוטפים וצילומים לאורך כל תהליך הייצור וההקמה.",
    icon: "visibility",
  },
  {
    title: "אחריות לדורות",
    description: "אנו מתחייבים לאיכות האבן והעבודה לאורך עשרות שנים.",
    icon: "shield",
  },
] as const

function HighlightIcon({ icon }: { icon: (typeof HIGHLIGHTS)[number]["icon"] }) {
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
  return (
    <section className={styles.section} aria-label="הערכים שלנו">
      <div className={styles.container}>
        {HIGHLIGHTS.map((highlight) => (
          <article className={styles.highlight} key={highlight.title}>
            <span className={styles.icon}>
              <HighlightIcon icon={highlight.icon} />
            </span>
            <div>
              <h2>{highlight.title}</h2>
              <p>{highlight.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
