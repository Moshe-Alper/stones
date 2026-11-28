import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
import AboutContent from "./AboutContent"

describe("AboutContent", () => {
  it("renders the page title as the only h1", () => {
    render(<AboutContent />)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("אודות שיש אלפר")
  })

  it("tells the family story with the founder and the generations", () => {
    render(<AboutContent />)
    expect(screen.getByRole("heading", { level: 2, name: "הסיפור שלנו" })).toBeInTheDocument()
    expect(screen.getByText(/ייסד משה אלפר בשנת 1965/)).toBeInTheDocument()
    expect(screen.getByText(/והנכדים עובדים לצידו/)).toBeInTheDocument()
  })

  it("shows the factory yard and the hand-carving photos", () => {
    render(<AboutContent />)
    expect(
      screen.getByRole("img", { name: "חצר המפעל של שיש אלפר בפרדס חנה" }).getAttribute("src"),
    ).toContain("factory-yard.jpg")
    expect(
      screen.getByRole("img", { name: "חריטת עיטור באבן בעבודת יד במפעל שיש אלפר" }).getAttribute("src"),
    ).toContain("carving-detail.webp")
  })

  it("hides the factory strip while it would show placeholders", () => {
    render(<AboutContent />)
    expect(screen.queryByRole("heading", { name: "המפעל שלנו בפרדס חנה" })).not.toBeInTheDocument()
  })

  it("has a breadcrumb back to home", () => {
    render(<AboutContent />)
    expect(screen.getByRole("link", { name: "בית" })).toHaveAttribute("href", "/")
  })
})
