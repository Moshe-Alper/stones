import Link from "next/link";
import styles from "./MaterialsGrid.module.css";

const EXCERPT =
  'ב"שיש אלפר", אנו מבינים שכל מצבה היא סיפור חיים שלם. הצוות שלנו מלווה את המשפחות באופן אישי, מרגע התכנון ועד…';

const MATERIALS = [
  {
    id: "granite",
    title: "גרניט פרימיום",
    image: "https://placehold.co/600x600/b7b7b3/222?text=Granite",
  },
  {
    id: "marble",
    title: "שיש איטלקי",
    image: "https://placehold.co/600x600/d9d6ce/222?text=Marble",
  },
  {
    id: "basalt",
    title: "אבן טבעית ועיצוב אישי",
    image: "https://placehold.co/600x600/8a8a86/222?text=Basalt",
  },
];

export default function MaterialsGrid() {
  return (
    <section className={styles.section} aria-label="חומרים וסגנונות">
      <div className={styles.header}>
        <h2 className={styles.heading}>חומרים וסגנונות</h2>
        <div className={styles.divider} />
      </div>
      <div className={styles.grid}>
        {MATERIALS.map((material) => (
          <article className={styles.card} key={material.id}>
            {/* TODO: replace with client-provided photography */}
            <img
              className={styles.cardImage}
              src={material.image}
              alt={material.title}
            />
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{material.title}</h3>
              <p className={styles.cardExcerpt}>{EXCERPT}</p>
              <Link href="/catalog" className={styles.cardLink}>
                לכל הדגמים
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
