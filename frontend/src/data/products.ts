// Seed product data for the Product Detail page (PRD Screen 3 / F2).
// A single hard-coded product matching Figma frame 12:133 "Product Detail (RTL Verified)".
// A real product database is a follow-up; this constant keeps the exact Figma copy
// (price range, dimensions, spec lists) editable from one place.

export type ProductPhoto = {
  id: string;
  alt: string;
  // TODO: replace with client-provided photography (neutral placeholder for now).
  image: string;
};

export type ProductOption = {
  id: string;
  label: string;
  active?: boolean;
};

export type SpecGroup = {
  id: string;
  title: string;
  icon: "delivery" | "base" | "dimensions";
  items: string[];
};

export type RelatedProduct = {
  id: string;
  title: string;
  categoryLabel: string;
  href: string;
};

export type Product = {
  slug: string;
  name: string;
  description: string;
  photos: ProductPhoto[];
  categoryOptions: ProductOption[];
  symbolOptions: ProductOption[];
  engravingPlaceholder: string;
  engravingPreview: string[];
  price: { min: number; max: number };
  priceNote: string;
  priceLabel: string;
  reassurance: string;
  specGroups: SpecGroup[];
  related: RelatedProduct[];
  // Breadcrumb trail: product > category > catalog (RTL).
  categoryLabel: string;
  categoryHref: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "black-absolute-granite",
    name: "מצבת גרניט שחורה אבסולוט",
    description:
      "מצבה קלאסית ויוקרתית מגרניט שחור איכותי, המיוצרת בפיקוח אישי של משפחת אלפר. אנו מבטיחים עמידות מקסימלית לתנאי מזג האוויר בישראל ושמירה על הברק לאורך עשרות שנים של זיכרון.",
    photos: [
      { id: "main", alt: "מצבת גרניט שחורה אבסולוט - תצוגה ראשית", image: "" },
      { id: "gallery-1", alt: "מצבת גרניט שחורה אבסולוט - זווית 1", image: "" },
      { id: "gallery-2", alt: "מצבת גרניט שחורה אבסולוט - זווית 2", image: "" },
      { id: "gallery-3", alt: "מצבת גרניט שחורה אבסולוט - זווית 3", image: "" },
      { id: "gallery-4", alt: "מצבת גרניט שחורה אבסולוט - זווית 4", image: "" },
    ],
    categoryOptions: [
      { id: "special", label: "מיוחדות" },
      { id: "granite", label: "גרניט", active: true },
      { id: "hebron", label: "אבן חברון" },
      { id: "turkish", label: "שיש טורקי" },
    ],
    symbolOptions: [
      { id: "none", label: "ללא סמל" },
      { id: "olive", label: "ענף זית" },
      { id: "book", label: "ספר פתוח" },
      { id: "star", label: "מגן דוד", active: true },
    ],
    engravingPlaceholder: "הקלידו כאן את הכיתוב המבוקש...",
    engravingPreview: ['פ"נ', "[שם המנוח]", 'נלב"ע ביום...'],
    price: { min: 8400, max: 12500 },
    priceNote: "*המחיר הסופי ייקבע לאחר בחירת כלל המרכיבים",
    priceLabel: "הערכת מחיר בסיסית",
    reassurance: "ליווי אישי ורגיש לאורך כל התהליך בפיקוח ישיר של בני משפחת אלפר",
    specGroups: [
      {
        id: "delivery",
        title: "זמני אספקה והתקנה",
        icon: "delivery",
        items: [
          "ייצור וסיתת: 14-21 ימי עסקים",
          "התקנה בפריסה ארצית",
          "תיאום מלא מול הנהלת בתי העלמין",
          'אפשרות לשירות "הקמה לפני השלושים"',
        ],
      },
      {
        id: "base",
        title: "תשתית ובסיס",
        icon: "base",
        items: [
          "בסיס בטון מזוין תקני",
          "חיפוי בסיס תואם לסוג האבן",
          "ניקוז מובנה למניעת הצטברות מים",
          "אחריות ל-20 שנה על יציבות המבנה",
        ],
      },
      {
        id: "dimensions",
        title: "מידות המצבה",
        icon: "dimensions",
        items: [
          'גובה כולל: 80 ס"מ',
          'רוחב: 60 ס"מ',
          'עובי האבן: 10-12 ס"מ',
          "ניתן להתאמה אישית לפי דרישות בית העלמין",
        ],
      },
    ],
    related: [
      {
        id: "art-combined",
        title: "מצבה משולבת - דגם ארט",
        categoryLabel: "קטגוריית מצבות מיוחדות",
        href: "/catalog/special",
      },
      {
        id: "red-rock-granite",
        title: "גרניט אדום סלע",
        categoryLabel: "קטגוריית גרניט",
        href: "/catalog/granite",
      },
      {
        id: "hebron-processed",
        title: "מצבת אבן חברון מעובדת",
        categoryLabel: "קטגוריית אבן חברון",
        href: "/catalog/hebron-marble",
      },
      {
        id: "turkish-classic",
        title: "שיש טורקי קלאסי",
        categoryLabel: "קטגוריית שיש טורקי",
        href: "/catalog/turkish-marble",
      },
    ],
    categoryLabel: "מצבות גרניט",
    categoryHref: "/catalog/granite",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}
