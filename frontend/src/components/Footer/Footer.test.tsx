import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/test/renderWithIntl";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the brand name and copyright", () => {
    render(<Footer />);
    expect(screen.getByText("שיש אלפר")).toBeInTheDocument();
    expect(
      screen.getByText(`© ${new Date().getFullYear()} שיש אלפר. כל הזכויות שמורות.`)
    ).toBeInTheDocument();
  });

  it("renders a link to the catalog", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "קטלוג מוצרים" })).toHaveAttribute(
      "href",
      "/catalog"
    );
  });

  it("renders the static visitor count placeholder", () => {
    render(<Footer />);
    expect(screen.getByText("מבקרים: 12,482")).toBeInTheDocument();
  });
});
