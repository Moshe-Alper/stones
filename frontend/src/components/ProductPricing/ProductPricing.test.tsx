import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductPricing from "./ProductPricing";
import { PRODUCTS } from "@/data/products";

const product = PRODUCTS[0];

describe("ProductPricing", () => {
  it("renders the price disclaimer note", () => {
    render(<ProductPricing product={product} />);
    expect(screen.getByText(product.priceNote)).toBeInTheDocument();
  });

  it("renders the price range formatted from data", () => {
    render(<ProductPricing product={product} />);
    expect(screen.getByText("₪8,400 - ₪12,500")).toBeInTheDocument();
    expect(screen.getByText(product.priceLabel)).toBeInTheDocument();
  });

  it("links the primary CTA to /contact", () => {
    render(<ProductPricing product={product} />);
    expect(
      screen.getByRole("link", { name: "בקשת הצעת מחיר" })
    ).toHaveAttribute("href", "/contact");
  });

  it("renders an inert (disabled) save button", () => {
    render(<ProductPricing product={product} />);
    expect(screen.getByRole("button", { name: "שמירת הדגם" })).toBeDisabled();
  });

  it("renders the reassurance line", () => {
    render(<ProductPricing product={product} />);
    expect(screen.getByText(product.reassurance)).toBeInTheDocument();
  });
});
