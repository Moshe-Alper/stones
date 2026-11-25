import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
import FamilyNote from "./FamilyNote"

describe("FamilyNote", () => {
  it("shows the founding-year line with the founding year", () => {
    render(<FamilyNote />)
    expect(screen.getByText("עסק משפחתי מאז 1965")).toBeInTheDocument()
  })

  it("renders the one-sentence statement as the section heading", () => {
    render(<FamilyNote />)
    expect(screen.getByRole("heading", { name: /משפחת אלפר מלווה אתכם אישית/ })).toBeInTheDocument()
  })
})
