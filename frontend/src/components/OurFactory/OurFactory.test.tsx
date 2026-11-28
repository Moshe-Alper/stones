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

  it("shows a supplied photo as a real image", () => {
    render(<OurFactory />)
    const truck = screen.getByRole("img", { name: "משאית המפעל" })
    expect(truck.getAttribute("src")).toContain("factory-yard.jpg")
  })

  it("captions missing photos with what should be shot", () => {
    render(<OurFactory />)
    for (const caption of ["מנוף בעבודה", "מלגזה מעמיסה אבן", "מכונת חיתוך אבן"]) {
      expect(screen.getByRole("img", { name: caption }).tagName).toBe("DIV")
    }
  })

  it("renders only the photos it is given", () => {
    render(<OurFactory photos={FACTORY_PHOTOS.filter((photo) => photo.file)} />)
    const tiles = screen.getAllByRole("listitem")
    expect(tiles).toHaveLength(FACTORY_PHOTOS.filter((photo) => photo.file).length)
    expect(screen.queryByRole("img", { name: "מנוף בעבודה" })).not.toBeInTheDocument()
  })
})
