import styles from "./PhotoPlaceholder.module.css"

type PhotoPlaceholderProps = {
  // Describes the photo that belongs here, so the owner knows what to shoot.
  caption: string
  tone?: "light" | "dark"
}

// Fills its positioned parent, standing in for a photo the owner hasn't supplied yet.
export default function PhotoPlaceholder({ caption, tone = "light" }: PhotoPlaceholderProps) {
  return (
    <div
      className={tone === "dark" ? `${styles.placeholder} ${styles.dark}` : styles.placeholder}
      role="img"
      aria-label={caption}
    >
      <span className={styles.caption}>{caption}</span>
    </div>
  )
}
