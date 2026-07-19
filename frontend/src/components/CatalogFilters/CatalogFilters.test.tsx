import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CatalogFilters from "./CatalogFilters";

describe("CatalogFilters", () => {
  it("renders the sidebar heading", () => {
    render(<CatalogFilters />);
    expect(
      screen.getByRole("heading", { name: "סינון לפי קטגוריה" })
    ).toBeInTheDocument();
  });

  it("renders the material and style filter groups", () => {
    render(<CatalogFilters />);
    expect(screen.getByText("סוגי מצבות")).toBeInTheDocument();
    expect(screen.getByText("סגנון עיצובי")).toBeInTheDocument();
    expect(screen.getByText("טווח מחירים")).toBeInTheDocument();
  });

  it("renders the four material checkboxes", () => {
    render(<CatalogFilters />);
    ["שיש טורקי", "שיש חברוני", "מצבות אבן גרניט", "מצבות מיוחדות"].forEach(
      (label) => {
        expect(screen.getByLabelText(label)).toBeInTheDocument();
      }
    );
  });

  it("renders the price range labels", () => {
    render(<CatalogFilters />);
    expect(screen.getByText("₪3,000")).toBeInTheDocument();
    expect(screen.getByText("₪50,000")).toBeInTheDocument();
  });

  it("renders the CTA linking to the contact page", () => {
    render(<CatalogFilters />);
    const cta = screen.getByRole("link", { name: "ייעוץ אישי מהלב" });
    expect(cta).toHaveAttribute("href", "/contact");
  });

  it("renders filter controls as disabled (visual-only)", () => {
    render(<CatalogFilters />);
    expect(screen.getByLabelText("שיש טורקי")).toBeDisabled();
    expect(screen.getByLabelText("טווח מחירים")).toBeDisabled();
  });
});
