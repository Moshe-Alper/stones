import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { GALLERY_PHOTOS, getFeaturedPhotos } from "./gallery";
import { CATEGORIES } from "@/components/CatalogGrid/categories";

const GALLERY_DIR = path.join(
  __dirname,
  "../../public/images/gallery"
);

describe("GALLERY_PHOTOS manifest", () => {
  it("tags every file actually present in public/images/gallery, with none left over", () => {
    const filesOnDisk = readdirSync(GALLERY_DIR)
      .filter((file) => !file.startsWith("."))
      .sort();
    const filesInManifest = GALLERY_PHOTOS.map((photo) => photo.file).sort();
    expect(filesInManifest).toEqual(filesOnDisk);
  });

  it("only uses category slugs that exist in CATEGORIES", () => {
    const validSlugs = CATEGORIES.map((category) => category.slug);
    GALLERY_PHOTOS.forEach((photo) => {
      expect(validSlugs).toContain(photo.category);
    });
  });

  it("has no duplicate file entries", () => {
    const files = GALLERY_PHOTOS.map((photo) => photo.file);
    expect(new Set(files).size).toBe(files.length);
  });

  it("only uses valid style tags", () => {
    GALLERY_PHOTOS.forEach((photo) => {
      expect(["classic", "modern"]).toContain(photo.style);
    });
  });
});

describe("getFeaturedPhotos", () => {
  it("returns the 8 homepage photos in featured order", () => {
    const featured = getFeaturedPhotos()
    expect(featured).toHaveLength(8)
    expect(featured.map((photo) => photo.featured)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  it("uses each featured position at most once", () => {
    const positions = GALLERY_PHOTOS.flatMap((photo) =>
      photo.featured === undefined ? [] : [photo.featured],
    )
    expect(new Set(positions).size).toBe(positions.length)
  })
})
