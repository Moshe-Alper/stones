import { screen } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
import { describe, expect, it } from "vitest"
import { CONTACT_DETAILS } from "@/data/contact"
import ContactDetails from "./ContactDetails"

describe("ContactDetails", () => {
  it("links the studio address to Google Maps directions", () => {
    render(<ContactDetails />)
    expect(screen.getByRole("link", { name: /כתובת המפעל/ })).toHaveAttribute(
      "href",
      CONTACT_DETAILS.mapsUrl,
    )
  })

  it("links the email address", () => {
    render(<ContactDetails />)
    expect(screen.getByRole("link", { name: /דואר אלקטרוני/ })).toHaveAttribute(
      "href",
      `mailto:${CONTACT_DETAILS.email}`,
    )
  })

  it("does not repeat the phone number shown in the hero", () => {
    render(<ContactDetails />)
    expect(screen.queryByRole("link", { name: /טלפון/ })).not.toBeInTheDocument()
  })
})
