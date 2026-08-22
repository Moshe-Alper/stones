import styles from "./RenovationProblems.module.css";

const PROBLEMS = [
  {
    title: "כתמי לחות ומים",
    description: "חדירת רטיבות גורמת להכתמה ולשינוי גוון האבן לאורך זמן.",
    icon: "droplet",
  },
  {
    title: "טחב ואבנית",
    description: "הצטברות טחב ומשקעים המכהים את המראה המקורי של המצבה.",
    icon: "moss",
  },
  {
    title: "שקיעה ונטייה",
    description: "תזוזת יסודות הגורמת להטיה או לשקיעה של המצבה בקרקע.",
    icon: "tilt",
  },
  {
    title: "דהיית כיתוב",
    description: "התכהות או דהייה של צבע האותיות והפרטים החרוטים.",
    icon: "text",
  },
  {
    title: "סדקים ושברים",
    description: "נזקי מזג אוויר או פגיעה מכנית שיצרו סדק באבן.",
    icon: "crack",
  },
] as const;

function ProblemIcon({ icon }: { icon: (typeof PROBLEMS)[number]["icon"] }) {
  if (icon === "droplet") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M16 4s9 10.5 9 17a9 9 0 1 1-18 0c0-6.5 9-17 9-17Z" />
      </svg>
    );
  }

  if (icon === "moss") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M4 27c6-2 8-8 8-13M14 27c4-3 5-9 4-15M20 27c5-1 8-6 8-12" />
      </svg>
    );
  }

  if (icon === "tilt") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M11 4h9l3 22H8L11 4Z" />
        <path d="M5 28h22" />
      </svg>
    );
  }

  if (icon === "text") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path d="M7 26 13 6h2l6 20M9.5 18h9" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M8 4h16v24H8V4Z" />
      <path d="m14 4 3 8-4 4 4 8" />
    </svg>
  );
}

export default function RenovationProblems() {
  return (
    <section className={styles.section} aria-label="נזקים נפוצים">
      <h2 className={styles.heading}>נזקים נפוצים שאנו מטפלים בהם</h2>
      <div className={styles.grid}>
        {PROBLEMS.map((problem) => (
          <article className={styles.card} key={problem.title}>
            <span className={styles.icon}>
              <ProblemIcon icon={problem.icon} />
            </span>
            <h3 className={styles.cardTitle}>{problem.title}</h3>
            <p className={styles.cardDesc}>{problem.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
