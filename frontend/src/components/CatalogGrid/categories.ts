export type CategorySlug = "turkish-marble" | "hebron-marble" | "granite" | "special";

export type Category = {
  id: string;
  slug: CategorySlug;
  featured?: boolean;
};

// The Catalog is a grid of 4 material/design categories (not individual SKUs).
// Title/description text lives in messages/{locale}.json under "Categories.<slug>"
// (see .plan/017) — this file only holds the stable id/slug/order.
// Order is intentional: hebron-marble leads as the business's flagship/most-requested stone.
export const CATEGORIES: Category[] = [
  {
    id: "hebron-marble",
    slug: "hebron-marble",
    featured: true,
  },
  {
    id: "turkish-marble",
    slug: "turkish-marble",
  },
  {
    id: "granite",
    slug: "granite",
  },
  {
    id: "special",
    slug: "special",
  },
];
