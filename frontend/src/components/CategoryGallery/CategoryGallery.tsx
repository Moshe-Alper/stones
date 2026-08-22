"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./CategoryGallery.module.css";
import { GALLERY_PHOTOS, type GalleryStyle } from "@/data/gallery";
import type { CategorySlug } from "@/components/CatalogGrid/categories";

const STYLE_FILTERS: { id: GalleryStyle | "all"; label: string }[] = [
  { id: "all", label: "הכל" },
  { id: "classic", label: "קלאסי" },
  { id: "modern", label: "מודרני" },
];

export default function CategoryGallery({
  category,
  categoryTitle,
}: {
  category: CategorySlug;
  categoryTitle: string;
}) {
  const categoryPhotos = GALLERY_PHOTOS.filter(
    (photo) => photo.category === category
  );
  const [styleFilter, setStyleFilter] = useState<GalleryStyle | "all">("all");
  const photos =
    styleFilter === "all"
      ? categoryPhotos
      : categoryPhotos.filter((photo) => photo.style === styleFilter);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex]);

  if (categoryPhotos.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.styleFilter}
        role="group"
        aria-label="סינון לפי סגנון"
      >
        {STYLE_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={
              styleFilter === filter.id
                ? `${styles.styleFilterButton} ${styles.styleFilterButtonActive}`
                : styles.styleFilterButton
            }
            aria-pressed={styleFilter === filter.id}
            onClick={() => {
              setStyleFilter(filter.id);
              setOpenIndex(null);
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {photos.length === 0 ? (
        <p className={styles.emptyState}>אין תמונות בסגנון זה בקטגוריה זו.</p>
      ) : (
        <ul className={styles.grid} aria-label={`תמונות ${categoryTitle}`}>
          {photos.map((photo, index) => (
            <li key={photo.file}>
              <button
                type="button"
                className={styles.thumb}
                onClick={() => setOpenIndex(index)}
                aria-label={`הגדלת תמונה ${index + 1} מתוך ${categoryTitle}`}
              >
                {/* Real photos come in mixed orientations/aspect ratios, so
                    `fill` inside a fixed-ratio box is used instead of the
                    explicit width/height pattern used elsewhere on the site. */}
                <Image
                  src={`/images/gallery/${photo.file}`}
                  alt={`${categoryTitle} - תמונה ${index + 1}`}
                  fill
                  sizes="(max-width: 700px) 50vw, 25vw"
                  className={styles.thumbImage}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {openIndex !== null && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`תמונה מוגדלת - ${categoryTitle}`}
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            className={styles.closeButton}
            aria-label="סגירה"
            onClick={() => setOpenIndex(null)}
          >
            ✕
          </button>
          <div className={styles.lightboxImageWrapper}>
            <Image
              src={`/images/gallery/${photos[openIndex].file}`}
              alt={`${categoryTitle} - תמונה ${openIndex + 1}`}
              fill
              sizes="90vw"
              className={styles.lightboxImage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
