import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductOptions from "./ProductOptions";
import { PRODUCTS } from "@/data/products";

const product = PRODUCTS[0];

describe("ProductOptions", () => {
  it("renders the category stone chips", () => {
    render(<ProductOptions product={product} />);
    product.categoryOptions.forEach((option) => {
      expect(
        screen.getByRole("button", { name: option.label })
      ).toBeInTheDocument();
    });
  });

  it("marks the active category chip with aria-pressed", () => {
    render(<ProductOptions product={product} />);
    expect(screen.getByRole("button", { name: "גרניט" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("renders the symbol buttons with the active one pressed", () => {
    render(<ProductOptions product={product} />);
    expect(
      screen.getByRole("button", { name: /מגן דוד/ })
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /ללא סמל/ })).toBeInTheDocument();
  });

  it("renders the engraving textarea placeholder and dark preview lines", () => {
    render(<ProductOptions product={product} />);
    expect(
      screen.getByPlaceholderText(product.engravingPlaceholder)
    ).toBeDisabled();
    product.engravingPreview.forEach((line) => {
      expect(screen.getByText(line)).toBeInTheDocument();
    });
  });
});
