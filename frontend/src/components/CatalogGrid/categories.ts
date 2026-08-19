export type CategorySlug = "turkish-marble" | "hebron-marble" | "granite" | "special";

export type Category = {
  id: string;
  slug: CategorySlug;
  title: string;
  description: string;
};

// The Catalog is a grid of 4 material/design categories (not individual SKUs).
// Copy taken directly from Figma frame 12:357 "Catalog (RTL Verified)".
export const CATEGORIES: Category[] = [
  {
    id: "turkish-marble",
    slug: "turkish-marble",
    title: "שיש טורקי",
    description: "שיש לבן איכותי, עמידות לשנים וסגנון קלאסי-מסורתי.",
  },
  {
    id: "hebron-marble",
    slug: "hebron-marble",
    title: "שיש חברוני",
    description: "האבן המוכרת והאהובה בבתי העלמין בישראל, בעיבודים מגוונים.",
  },
  {
    id: "granite",
    slug: "granite",
    title: "מצבות אבן גרניט",
    description:
      "חוזק בלתי מתפשר, מראה יוקרתי ומבחר צבעים - שחור, אפור, אדום וכחול.",
  },
  {
    id: "special",
    slug: "special",
    title: "מצבות מיוחדות",
    description:
      "שילוב אבני לקט, עיצובים אמנותיים ופיסול אישי המשקף את דמותו של הנפטר.",
  },
];
