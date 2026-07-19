import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import RelatedProducts from "./RelatedProducts";
import { PRODUCTS } from "@/data/products";

const items = PRODUCTS[0].related;

describe("RelatedProducts", () => {
  it("renders the section heading", () => {
    render(<RelatedProducts items={items} />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "אפשרויות הנצחה מקטגוריות נוספות",
      })
    ).toBeInTheDocument();
  });

  it("links the header to the full catalog", () => {
    render(<RelatedProducts items={items} />);
    expect(screen.getByRole("link", { name: "לכל הקטלוג" })).toHaveAttribute(
      "href",
      "/catalog"
    );
  });

  it("renders four related cards linking to their targets", () => {
    render(<RelatedProducts items={items} />);
    expect(items).toHaveLength(4);
    items.forEach((item) => {
      expect(
        screen.getByRole("heading", { level: 4, name: item.title })
      ).toBeInTheDocument();
      expect(screen.getByText(item.categoryLabel)).toBeInTheDocument();
      const link = screen.getByRole("link", { name: new RegExp(item.title) });
      expect(link).toHaveAttribute("href", item.href);
    });
  });
});
