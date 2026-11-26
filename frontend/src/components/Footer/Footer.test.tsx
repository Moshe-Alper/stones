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

  it("does not render placeholder info, accessibility badge or visitor count", () => {
    render(<Footer />);
    expect(screen.queryByText("מידע נוסף")).not.toBeInTheDocument();
    expect(screen.queryByText(/נגישות/)).not.toBeInTheDocument();
    expect(screen.queryByText(/מבקרים/)).not.toBeInTheDocument();
  });
});
