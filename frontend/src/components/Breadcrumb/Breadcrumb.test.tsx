import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl as render } from "@/test/renderWithIntl";
import Breadcrumb from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("renders the default catalog trail when no items are passed", () => {
    render(<Breadcrumb />);
    expect(screen.getByText("קטלוג מצבות")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "בית" })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("orders the default trail Home first, current page last", () => {
    const { container } = render(<Breadcrumb />);
    const labels = Array.from(container.querySelectorAll("li")).map((li) =>
      li.textContent?.trim()
    );
    expect(labels).toEqual(["בית", "קטלוג מצבות"]);
  });

  it("marks the default current page with aria-current", () => {
    render(<Breadcrumb />);
    expect(screen.getByText("קטלוג מצבות")).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("renders a passed 3-level trail with links and a current page", () => {
    render(
      <Breadcrumb
        items={[
          { label: "קטלוג מצבות", href: "/catalog" },
          { label: "מצבות גרניט", href: "/catalog/granite" },
          { label: "מצבת גרניט שחורה אבסולוט" },
        ]}
      />
    );

    expect(
      screen.getByText("מצבת גרניט שחורה אבסולוט")
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", { name: "מצבות גרניט" })
    ).toHaveAttribute("href", "/catalog/granite");
    expect(
      screen.getByRole("link", { name: "קטלוג מצבות" })
    ).toHaveAttribute("href", "/catalog");
  });
});
