import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/test/renderWithIntl";
import MaterialsGrid from "./MaterialsGrid";

describe("MaterialsGrid", () => {
  it("renders the section heading", () => {
    render(<MaterialsGrid />);
    expect(
      screen.getByRole("heading", { name: "חומרים וסגנונות" })
    ).toBeInTheDocument();
  });

  it("renders all three material cards with titles", () => {
    render(<MaterialsGrid />);
    expect(screen.getByText("אבן טבעית ועיצוב אישי")).toBeInTheDocument();
    expect(screen.getByText("שיש חברוני")).toBeInTheDocument();
    expect(screen.getByText("גרניט פרימיום")).toBeInTheDocument();
  });

  it("renders a 'לכל הדגמים' link per card, pointing to /catalog", () => {
    render(<MaterialsGrid />);
    const links = screen.getAllByRole("link", { name: "לכל הדגמים" });
    expect(links).toHaveLength(3);
    links.forEach((link) => expect(link).toHaveAttribute("href", "/catalog"));
  });
});
