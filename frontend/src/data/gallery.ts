import type { CategorySlug } from "@/data/categories";

export type GalleryStyle = "classic" | "modern";

export type GalleryPhoto = {
  file: string;
  category: CategorySlug;
  style: GalleryStyle;
  /** Position (1-based) in the homepage "Recent work" grid; omit to leave the photo off the homepage. */
  featured?: number;
};

// Real installation photos, manually curated and manually blurred by the owner
// (see .plan/011-2026-07-23-google-photos-gallery-headstone-blur.md). Category and
// style tags below are a first-pass manual visual read (not a re-run of any
// automated classifier) — expect occasional mistakes, fix by editing a line here.
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { file: "gallery-05.jpg", category: "granite", style: "modern" },
  { file: "gallery-08.jpg", category: "granite", style: "classic" },
  { file: "gallery-11.jpg", category: "hebron-marble", style: "classic" },
  { file: "gallery-16.jpg", category: "special", style: "modern" },
  { file: "gallery-21.jpg", category: "hebron-marble", style: "classic" },
  { file: "gallery-24.jpg", category: "hebron-marble", style: "modern", featured: 4 },
  { file: "gallery-31.jpg", category: "turkish-marble", style: "modern" },
  { file: "gallery-34.jpg", category: "turkish-marble", style: "classic" },
  { file: "gallery-37.jpg", category: "turkish-marble", style: "modern" },
  { file: "gallery-46.jpg", category: "turkish-marble", style: "modern" },
  { file: "gallery-53.jpg", category: "granite", style: "modern" },
  { file: "gallery-54.jpg", category: "turkish-marble", style: "classic" },
  { file: "gallery-55.jpg", category: "hebron-marble", style: "classic" },
  { file: "gallery-56.jpg", category: "turkish-marble", style: "classic" },
  { file: "gallery-57.jpg", category: "hebron-marble", style: "classic" },
  { file: "gallery-58.jpg", category: "hebron-marble", style: "classic" },
  { file: "gallery-59.jpg", category: "hebron-marble", style: "modern", featured: 7 },
  { file: "gallery-60.jpg", category: "hebron-marble", style: "classic" },
  { file: "gallery-61.jpg", category: "hebron-marble", style: "classic" },
  { file: "gallery-62.jpg", category: "hebron-marble", style: "classic" },
  { file: "gallery-63.jpg", category: "turkish-marble", style: "classic" },
  { file: "gallery-64.jpg", category: "special", style: "modern", featured: 6 },
  { file: "gallery-65.jpg", category: "hebron-marble", style: "classic" },
  { file: "gallery-66.jpg", category: "turkish-marble", style: "classic" },
  { file: "gallery-67.jpg", category: "special", style: "modern" },
  { file: "gallery-68.jpg", category: "granite", style: "classic" },
  { file: "gallery-69.jpg", category: "hebron-marble", style: "classic" },
  { file: "gallery-70.jpg", category: "granite", style: "classic" },
  { file: "gallery-71.jpg", category: "hebron-marble", style: "modern" },
  { file: "gallery-72.jpeg", category: "special", style: "modern", featured: 1 },
  { file: "gallery-73.jpeg", category: "hebron-marble", style: "classic", featured: 2 },
  { file: "gallery-74.jpeg", category: "special", style: "modern" },
  { file: "gallery-75.jpeg", category: "turkish-marble", style: "modern", featured: 8 },
  { file: "gallery-76.jpeg", category: "hebron-marble", style: "classic" },
  { file: "gallery-77.jpeg", category: "turkish-marble", style: "classic" },
  { file: "gallery-78.jpeg", category: "special", style: "modern" },
  { file: "gallery-79.jpeg", category: "turkish-marble", style: "classic" },
  { file: "gallery-80.jpeg", category: "hebron-marble", style: "classic" },
  { file: "gallery-81.jpeg", category: "turkish-marble", style: "modern" },
  { file: "gallery-82.jpeg", category: "granite", style: "classic" },
  { file: "gallery-83.jpeg", category: "granite", style: "classic" },
  { file: "gallery-84.jpeg", category: "granite", style: "modern", featured: 5 },
  { file: "gallery-85.jpeg", category: "hebron-marble", style: "classic" },
  { file: "gallery-86.jpeg", category: "granite", style: "classic", featured: 3 },
  { file: "gallery-87.jpeg", category: "hebron-marble", style: "classic" },
  { file: "gallery-88.jpg", category: "hebron-marble", style: "classic" },
  { file: "gallery-89.jpg", category: "granite", style: "modern" },
  { file: "gallery-90.jpg", category: "granite", style: "classic" },
];

export function getCategoryThumbnail(
  category: CategorySlug,
): GalleryPhoto | undefined {
  return GALLERY_PHOTOS.find((photo) => photo.category === category);
}

// Homepage "Recent work" grid, in `featured` order. To change which photos appear,
// move the `featured: N` markers above — the grid's tall/wide tile pattern is by
// position (see RecentWork.module.css), so portrait photos read best at 1 and 3.
export function getFeaturedPhotos(): GalleryPhoto[] {
  return GALLERY_PHOTOS.filter((photo) => photo.featured !== undefined).sort(
    (a, b) => (a.featured ?? 0) - (b.featured ?? 0),
  );
}

export function getCategoryPhotoCount(category: CategorySlug): number {
  return GALLERY_PHOTOS.filter((photo) => photo.category === category).length
}
