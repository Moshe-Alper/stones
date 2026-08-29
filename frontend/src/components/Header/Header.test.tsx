import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/test/renderWithIntl";
import Header from "./Header";

describe("Header", () => {
  it("renders the brand name", () => {
    render(<Header />);
    expect(screen.getByText("שיש אלפר")).toBeInTheDocument();
  });

  it("renders the contact CTA linking to /contact", () => {
    render(<Header />);
    const cta = screen.getByRole("link", { name: "צור קשר" });
    expect(cta).toHaveAttribute("href", "/contact");
  });

  it("renders nav links including catalog", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "קטלוג" })).toHaveAttribute(
      "href",
      "/catalog"
    );
  });

  it("links the brand/logo to the homepage", () => {
    render(<Header />);
    expect(
      screen.getByRole("link", { name: "שיש אלפר, לעמוד הבית" })
    ).toHaveAttribute("href", "/");
  });

  it("renders a language switcher with the current locale disabled", () => {
    render(<Header />);
    const group = screen.getByRole("group", { name: "בחירת שפה" });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "עברית" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "EN" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "RU" })).not.toBeDisabled();
  });
});
