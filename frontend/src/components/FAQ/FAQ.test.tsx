import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/test/renderWithIntl";
import FAQ from "./FAQ";

describe("FAQ", () => {
  it("renders the heading and the faq anchor id", () => {
    const { container } = render(<FAQ />);
    expect(screen.getByRole("heading", { name: "שאלות נפוצות" })).toBeInTheDocument();
    expect(container.querySelector("#faq")).toBeInTheDocument();
  });

  it("renders each question as a collapsible item", () => {
    render(<FAQ />);
    expect(
      screen.getByText("האם אתם מטפלים גם באישורים מול בית העלמין?")
    ).toBeInTheDocument();
  });

  it("renders the pricing question", () => {
    render(<FAQ />);
    expect(screen.getByText("מה כלול במחיר?")).toBeInTheDocument();
  });

  it("renders the service area question", () => {
    render(<FAQ />);
    expect(screen.getByText("באילו אזורים אתם פעילים?")).toBeInTheDocument();
  });
});
