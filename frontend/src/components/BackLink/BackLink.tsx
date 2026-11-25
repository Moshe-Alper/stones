import { Link } from "@/i18n/navigation";
import styles from "./BackLink.module.css";

// A compact "go back one level" affordance shown above the breadcrumb on the
// catalog pages. The chevron direction is handled in CSS (points right in RTL).
export default function BackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link href={href} className={styles.backLink}>
      {label}
    </Link>
  );
}
