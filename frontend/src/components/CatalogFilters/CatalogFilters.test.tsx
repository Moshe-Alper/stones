import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CatalogFilters from "./CatalogFilters";

describe("CatalogFilters", () => {
  it("renders the CTA linking to the contact page", () => {
    render(<CatalogFilters />);
    const cta = screen.getByRole("link", { name: "ייעוץ אישי מהלב" });
    expect(cta).toHaveAttribute("href", "/contact");
  });

  it("does not render any material/style/price filter controls", () => {
    render(<CatalogFilters />);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });
});
