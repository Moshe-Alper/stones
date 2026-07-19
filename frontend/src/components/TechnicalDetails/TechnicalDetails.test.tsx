import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import TechnicalDetails from "./TechnicalDetails";
import { PRODUCTS } from "@/data/products";

const specGroups = PRODUCTS[0].specGroups;

describe("TechnicalDetails", () => {
  it("renders the section heading", () => {
    render(<TechnicalDetails specGroups={specGroups} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "פרטים טכניים ומפרט" })
    ).toBeInTheDocument();
  });

  it("renders all three spec group titles", () => {
    render(<TechnicalDetails specGroups={specGroups} />);
    specGroups.forEach((group) => {
      expect(
        screen.getByRole("heading", { level: 4, name: group.title })
      ).toBeInTheDocument();
    });
  });

  it("renders every item in each spec group", () => {
    render(<TechnicalDetails specGroups={specGroups} />);
    specGroups.forEach((group) => {
      group.items.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });
  });
});
