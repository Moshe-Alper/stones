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

  it("renders exactly the two remaining questions", () => {
    const { container } = render(<FAQ />);
    expect(container.querySelectorAll("details")).toHaveLength(2);
  });

  it("no longer renders the removed pricing and cemetery-approvals questions", () => {
    render(<FAQ />);
    expect(screen.queryByText("מה כלול במחיר?")).toBeNull();
    expect(screen.queryByText("האם אתם מטפלים גם באישורים מול בית העלמין?")).toBeNull();
  });

  it("recommends granite, marble and Galilean dolomite", () => {
    render(<FAQ />);
    expect(screen.getByText(/גרניט, שיש וסלעי דולמיט גליליים/)).toBeInTheDocument();
  });

  it("presents the factory and offices as being in Pardes Hana", () => {
    render(<FAQ />);
    expect(screen.getByText(/המפעל והמשרדים שלנו נמצאים כאן, צמוד לבית העלמין/)).toBeInTheDocument();
  });

  it("renders the service area question", () => {
    render(<FAQ />);
    expect(screen.getByText("באילו אזורים אתם פעילים?")).toBeInTheDocument();
  });
});
