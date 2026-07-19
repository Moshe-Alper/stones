import styles from "./TechnicalDetails.module.css";
import type { SpecGroup } from "@/data/products";

function SpecIcon({ icon }: { icon: SpecGroup["icon"] }) {
  switch (icon) {
    case "base":
      return (
        <svg viewBox="0 0 20 16" aria-hidden="true" focusable="false">
          <rect
            x="2"
            y="9"
            width="16"
            height="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M4 9l6-6 6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      );
    case "dimensions":
      return (
        <svg viewBox="0 0 18 10" aria-hidden="true" focusable="false">
          <path
            d="M1 1v8h16V1M5 5v4M9 3v6M13 5v4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 18 18" aria-hidden="true" focusable="false">
          <circle
            cx="9"
            cy="9"
            r="7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M9 4.5V9l3 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      );
  }
}

// Technical specification cards rendered from the product's specGroups.
export default function TechnicalDetails({
  specGroups,
}: {
  specGroups: SpecGroup[];
}) {
  return (
    <section className={styles.section} aria-label="פרטים טכניים ומפרט">
      <h2 className={styles.heading}>פרטים טכניים ומפרט</h2>
      <div className={styles.grid}>
        {specGroups.map((group) => (
          <article className={styles.card} key={group.id}>
            <span className={styles.icon} aria-hidden="true">
              <SpecIcon icon={group.icon} />
            </span>
            <h4 className={styles.cardTitle}>{group.title}</h4>
            <ul className={styles.list}>
              {group.items.map((item, index) => (
                <li className={styles.item} key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
