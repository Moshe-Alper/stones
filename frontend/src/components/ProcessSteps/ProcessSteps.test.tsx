import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProcessSteps from "./ProcessSteps";

describe("ProcessSteps", () => {
  it("renders the section heading", () => {
    render(<ProcessSteps />);
    expect(
      screen.getByRole("heading", { name: "תהליך הליווי שלנו" })
    ).toBeInTheDocument();
  });

  it("renders all four process steps in order", () => {
    render(<ProcessSteps />);
    const stepTitles = ["פגישת ייעוץ", "תכנון ועיצוב", "ייצור אומנותי", "הצבה בשטח"];
    const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(headings).toEqual(stepTitles);
  });

  it("renders step numbers 01 through 04", () => {
    render(<ProcessSteps />);
    ["01", "02", "03", "04"].forEach((num) => {
      expect(screen.getByText(num)).toBeInTheDocument();
    });
  });
});
