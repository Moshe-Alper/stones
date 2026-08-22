import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { GALLERY_PHOTOS } from "./gallery";
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
