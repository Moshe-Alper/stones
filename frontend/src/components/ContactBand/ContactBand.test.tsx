import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
import ContactBand from "./ContactBand"

describe("ContactBand", () => {
  it("renders a tap-to-call link with the business phone number", () => {
    render(<ContactBand />)
    const call = screen.getByRole("link", { name: "התקשרו אלינו: 050-5282431" })
    expect(call).toHaveAttribute("href", "tel:+972505282431")
  })

  it("renders a WhatsApp link to the same number, opening in a new tab", () => {
    render(<ContactBand />)
    const whatsapp = screen.getByRole("link", { name: "וואטסאפ" })
    expect(whatsapp).toHaveAttribute("href", "https://wa.me/972505282431")
    expect(whatsapp).toHaveAttribute("target", "_blank")
  })

  it("links to the contact form and shows the service area", () => {
    render(<ContactBand />)
    expect(screen.getByRole("link", { name: "השאירו פרטים" })).toHaveAttribute("href", "/contact")
    expect(screen.getByText(/פרדס חנה-כרכור/)).toBeInTheDocument()
  })
})
