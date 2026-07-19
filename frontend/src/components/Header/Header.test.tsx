import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  it("renders the brand name", () => {
    render(<Header />);
    expect(screen.getByText("שיש אלפר")).toBeInTheDocument();
  });

  it("renders the consultation request CTA linking to /contact", () => {
    render(<Header />);
    const cta = screen.getByRole("link", { name: "בקשת ייעוץ" });
    expect(cta).toHaveAttribute("href", "/contact");
  });

  it("renders nav links including catalog and home", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "קטלוג" })).toHaveAttribute(
      "href",
      "/catalog"
    );
    expect(screen.getByRole("link", { name: "בית" })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("renders a disabled, visual-only language switcher", () => {
    render(<Header />);
    const langSwitcher = screen.getByRole("button", { name: "בחירת שפה" });
    expect(langSwitcher).toBeDisabled();
  });
});
