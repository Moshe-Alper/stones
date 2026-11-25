import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
import { getCategoryPhotoCount } from "@/data/gallery"
import CategoryTiles from "./CategoryTiles"

describe("CategoryTiles", () => {
  it("renders one tile per category, each linking to its gallery", () => {
    render(<CategoryTiles />)
    const expected = [
      ["שיש טורקי", "/catalog/turkish-marble"],
      ["שיש חברוני", "/catalog/hebron-marble"],
      ["מצבות אבן גרניט", "/catalog/granite"],
      ["מצבות מיוחדות", "/catalog/special"],
    ]
    expected.forEach(([title, href]) => {
      expect(screen.getByRole("link", { name: new RegExp(title) })).toHaveAttribute("href", href)
    })
  })

  it("shows the 'most popular' badge only on Hebron marble", () => {
    render(<CategoryTiles />)
    const badge = screen.getByText("הכי מבוקש")
    expect(badge.closest("a")).toHaveAttribute("href", "/catalog/hebron-marble")
    expect(screen.getAllByText("הכי מבוקש")).toHaveLength(1)
  })

  it("does not render per-tile description copy", () => {
    const { container } = render(<CategoryTiles />)
    expect(container.querySelector("p")).toBeNull()
  })

  it("hides photo counts on the default (homepage) tiles", () => {
    render(<CategoryTiles />)
    expect(screen.queryByText(/עבודות$/)).not.toBeInTheDocument()
  })

  it("renders an h1 heading and per-category photo counts in the large catalog variant", () => {
    render(<CategoryTiles size="large" headingLevel={1} heading="קטלוג דגמים" />)
    expect(screen.getByRole("heading", { level: 1, name: "קטלוג דגמים" })).toBeInTheDocument()
    const hebronCount = getCategoryPhotoCount("hebron-marble")
    expect(screen.getByText(`${hebronCount} עבודות`)).toBeInTheDocument()
  })

  it("leaves out the excluded category", () => {
    render(<CategoryTiles heading="סוגי אבן נוספים" excludeSlug="granite" />)
    expect(screen.getAllByRole("link")).toHaveLength(3)
    expect(screen.queryByRole("link", { name: /גרניט/ })).not.toBeInTheDocument()
  })
})
