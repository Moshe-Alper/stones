import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/test/renderWithIntl";
import BackLink from "./BackLink";

describe("BackLink", () => {
  it("renders a link to the given href with the given label", () => {
    render(<BackLink href="/catalog" label="חזרה לקטלוג" />);
    const link = screen.getByRole("link", { name: "חזרה לקטלוג" });
    expect(link).toHaveAttribute("href", "/catalog");
  });
});
