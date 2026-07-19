import styles from "./Philosophy.module.css";

const STATS = [
  { label: "נצחיות", desc: "חומרים עמידים לתנאי האקלים" },
  { label: "40+", desc: "שנות ניסיון באומנות האבן" },
];

export default function Philosophy() {
  return (
    <section id="brand-story" className={styles.section} aria-label="סיפור המותג">
      <div className={styles.grid}>
        <div className={styles.textCol}>
          <p className={styles.eyebrow}>המחויבות שלנו</p>
          <h2 className={styles.heading}>
            לוות אתכם ברגעים הקשים עם מקצועיות ורגישות
          </h2>
          <p className={styles.body}>
            {'ב"שיש אלפר", אנו מבינים שכל מצבה היא סיפור חיים שלם. המשפחה שלנו מלווה אתכם '}
            באופן אישי, דור אחר דור, מרגע התכנון ועד להקמה הסופית, תוך הקפדה על הפרטים הקטנים
            ביותר ושימוש בחומרי הגלם המובחרים ביותר בעולם.
          </p>
          <div className={styles.stats}>
            {STATS.map((stat) => (
              <div className={styles.stat} key={stat.label}>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statDesc}>{stat.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.imageFrame}>
          {/* TODO: replace with client-provided photography */}
          <img
            className={styles.image}
            src="https://placehold.co/800x900/eae6da/44403a?text=Craftsmanship"
            alt="אומן חורת מצבה"
          />
        </div>
      </div>
    </section>
  );
}
