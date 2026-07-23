import Image from "next/image";
import Link from "next/link";
import styles from "./MaterialsGrid.module.css";

const EXCERPT =
  'ב"שיש אלפר", אנו מבינים שכל מצבה היא סיפור חיים שלם. הצוות שלנו מלווה את המשפחות באופן אישי, מרגע התכנון ועד…';

const MATERIALS = [
  {
    id: "granite",
    title: "גרניט פרימיום",
    image: "/images/material-granite.webp",
    width: 1200,
    height: 800,
  },
  {
    id: "marble",
    title: "שיש איטלקי",
    image: "/images/material-marble.webp",
    width: 800,
    height: 1200,
  },
  {
    id: "basalt",
    title: "אבן טבעית ועיצוב אישי",
    image: "/images/material-basalt.webp",
    width: 1200,
    height: 798,
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
            <Image
              className={styles.cardImage}
              src={material.image}
              alt={material.title}
              width={material.width}
              height={material.height}
              sizes="(max-width: 900px) 100vw, 33vw"
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
