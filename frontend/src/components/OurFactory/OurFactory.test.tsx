import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
import { FACTORY_PHOTOS } from "@/data/factory-photos"
import OurFactory from "./OurFactory"

describe("OurFactory", () => {
  it("renders the Pardes Hana factory heading", () => {
    render(<OurFactory />)
    expect(screen.getByRole("heading", { name: "המפעל שלנו בפרדס חנה" })).toBeInTheDocument()
  })

  it("renders one tile per factory photo", () => {
    render(<OurFactory />)
    expect(screen.getAllByRole("listitem")).toHaveLength(FACTORY_PHOTOS.length)
  })

  it("captions missing photos with what should be shot", () => {
    render(<OurFactory />)
    for (const caption of ["משאית המפעל", "מנוף בעבודה", "מלגזה מעמיסה אבן", "מכונת חיתוך אבן"]) {
      expect(screen.getByRole("img", { name: caption })).toBeInTheDocument()
    }
  })
})
