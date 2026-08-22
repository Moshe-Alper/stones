import { SERVICE_AREA } from "@/data/contact";
import styles from "./ServiceArea.module.css";

export default function ServiceArea() {
  return (
    <section className={styles.section} aria-label="אזור שירות">
      <div className={styles.inner}>
        <p className={styles.summary}>{SERVICE_AREA.summary}</p>
        <ul className={styles.towns}>
          {SERVICE_AREA.towns.map((town) => (
            <li className={styles.chip} key={town}>
              {town}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
