import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
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
      screen.getByText("כמה זמן לוקח תהליך ההזמנה וההצבה של מצבה?")
    ).toBeInTheDocument();
  });

  it("renders the service area question", () => {
    render(<FAQ />);
    expect(screen.getByText("באילו אזורים אתם פעילים?")).toBeInTheDocument();
  });
});
