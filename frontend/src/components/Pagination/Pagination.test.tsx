import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/test/renderWithIntl";
import Pagination from "./Pagination";

describe("Pagination", () => {
  it("renders numbered page buttons", () => {
    render(<Pagination />);
    expect(screen.getByRole("button", { name: "עמוד 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "עמוד 2" })).toBeInTheDocument();
  });

  it("marks page 1 as the current page", () => {
    render(<Pagination />);
    expect(screen.getByRole("button", { name: "עמוד 1" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      screen.getByRole("button", { name: "עמוד 2" })
    ).not.toHaveAttribute("aria-current");
  });

  it("renders a previous control", () => {
    render(<Pagination />);
    expect(screen.getByRole("button", { name: "הקודם" })).toBeInTheDocument();
  });

  it("renders controls as disabled (non-navigating)", () => {
    render(<Pagination />);
    expect(screen.getByRole("button", { name: "עמוד 1" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "הקודם" })).toBeDisabled();
  });
});
