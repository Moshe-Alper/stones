import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
import ProcessSteps from "./ProcessSteps"

describe("ProcessSteps", () => {
  it("renders the four steps in order as a single list", () => {
    render(<ProcessSteps />)
    const items = screen.getAllByRole("listitem").map((item) => item.textContent)
    expect(items).toEqual([
      "1פגישת ייעוץ",
      "2עיצוב ונוסח",
      "3ייצור בסדנה",
      "4הצבה בבית העלמין",
    ])
  })

  it("has no long description paragraphs", () => {
    const { container } = render(<ProcessSteps />)
    expect(container.querySelector("p")).toBeNull()
  })
})
