import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductGallery from "./ProductGallery";
import type { ProductPhoto } from "@/data/products";

const PHOTOS: ProductPhoto[] = [
  { id: "main", alt: "ראשית", image: "" },
  { id: "t1", alt: "תמונה 1", image: "" },
  { id: "t2", alt: "תמונה 2", image: "" },
  { id: "t3", alt: "תמונה 3", image: "" },
  { id: "t4", alt: "תמונה 4", image: "" },
];

describe("ProductGallery", () => {
  it("renders the main image with its accessible label", () => {
    render(<ProductGallery photos={PHOTOS} productName="מצבה" />);
    expect(screen.getByRole("img", { name: "ראשית" })).toBeInTheDocument();
  });

  it("renders the four thumbnails from the remaining photos", () => {
    render(<ProductGallery photos={PHOTOS} productName="מצבה" />);
    ["תמונה 1", "תמונה 2", "תמונה 3", "תמונה 4"].forEach((label) => {
      expect(screen.getByRole("img", { name: label })).toBeInTheDocument();
    });
  });

  it("renders an inert (disabled) zoom button", () => {
    render(<ProductGallery photos={PHOTOS} productName="מצבה" />);
    expect(
      screen.getByRole("button", { name: "הגדלת התמונה" })
    ).toBeDisabled();
  });
});
