import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/test/renderWithIntl";
import heMessages from "../../../messages/he.json";
import CatalogGrid from "./CatalogGrid";
import { CATEGORIES } from "./categories";

const categoryText = (slug: string) =>
  (heMessages.Categories as Record<string, { title: string; description: string }>)[slug];

describe("CatalogGrid", () => {
  it("renders the section heading", () => {
    render(<CatalogGrid />);
    expect(
      screen.getByRole("heading", { level: 1, name: "קטלוג דגמים" })
    ).toBeInTheDocument();
  });

  it("renders the result count derived from the categories array", () => {
    render(<CatalogGrid />);
    expect(
      screen.getByText(`מציג ${CATEGORIES.length} קטגוריות נבחרות`)
    ).toBeInTheDocument();
  });

  it("renders all four category cards with titles and descriptions", () => {
    render(<CatalogGrid />);
    CATEGORIES.forEach((category) => {
      const { title, description } = categoryText(category.slug);
      expect(
        screen.getByRole("heading", { level: 3, name: title })
      ).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });

  it("renders a gallery link per card pointing to its category slug", () => {
    render(<CatalogGrid />);
    const links = screen.getAllByRole("link", { name: "לצפייה בגלריה" });
    expect(links).toHaveLength(CATEGORIES.length);
    CATEGORIES.forEach((category, index) => {
      expect(links[index]).toHaveAttribute(
        "href",
        `/catalog/${category.slug}`
      );
    });
  });
});
