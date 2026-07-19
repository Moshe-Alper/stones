import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Philosophy from "./Philosophy";

describe("Philosophy", () => {
  it("renders the heading and the brand-story anchor id", () => {
    render(<Philosophy />);
    expect(
      screen.getByRole("heading", {
        name: "לוות אתכם ברגעים הקשים עם מקצועיות ורגישות",
      })
    ).toBeInTheDocument();
  });

  it("renders the stat callouts", () => {
    render(<Philosophy />);
    expect(screen.getByText("נצחיות")).toBeInTheDocument();
    expect(screen.getByText("40+")).toBeInTheDocument();
  });
});
