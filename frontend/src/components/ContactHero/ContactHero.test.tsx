import { screen } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
import { describe, expect, it } from "vitest"
import { CONTACT_DETAILS } from "@/data/contact"
import ContactHero from "./ContactHero"

describe("ContactHero", () => {
  it("renders the page heading", () => {
    render(<ContactHero />)
    expect(
      screen.getByRole("heading", { level: 1, name: "ייעוץ אישי ומקצועי" }),
    ).toBeInTheDocument()
  })

  it("puts call and WhatsApp first", () => {
    render(<ContactHero />)
    expect(
      screen.getByRole("link", { name: `התקשרו אלינו: ${CONTACT_DETAILS.directPhone}` }),
    ).toHaveAttribute("href", CONTACT_DETAILS.phoneHref)
    expect(screen.getByRole("link", { name: "וואטסאפ" })).toHaveAttribute(
      "href",
      CONTACT_DETAILS.whatsappHref,
    )
  })

  it("introduces the form as the alternative", () => {
    render(<ContactHero />)
    expect(screen.getByText("או השאירו פרטים ונחזור אליכם")).toBeInTheDocument()
  })
})
