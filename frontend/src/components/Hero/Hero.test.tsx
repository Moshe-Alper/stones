import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";

describe("Hero", () => {
  it("renders the heading and subheading copy", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { name: "כיבוד זיכרון יקיריכם בכבוד ובעדינות" })
    ).toBeInTheDocument();
    expect(screen.getByText(/אנו מתמחים ביצירת מצבות/)).toBeInTheDocument();
  });

  it("renders a CTA linking to the catalog", () => {
    render(<Hero />);
    const catalogLink = screen.getByRole("link", { name: "לצפייה בקטלוג" });
    expect(catalogLink).toHaveAttribute("href", "/catalog");
  });

  it("renders a CTA linking to the brand story anchor", () => {
    render(<Hero />);
    const brandStoryLink = screen.getByRole("link", { name: "סיפור המותג" });
    expect(brandStoryLink).toHaveAttribute("href", "#brand-story");
  });
});
