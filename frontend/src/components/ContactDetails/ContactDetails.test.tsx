import { screen } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
import { describe, expect, it } from "vitest"
import { CONTACT_DETAILS } from "@/data/contact"
import heMessages from "../../../messages/he.json"
import ContactDetails from "./ContactDetails"

describe("ContactDetails", () => {
  it("renders usable phone, email, and address links", () => {
    render(<ContactDetails />)

    expect(
      screen.getByRole("link", { name: /כתובת הסטודיו/ }),
    ).toHaveAttribute("href", CONTACT_DETAILS.mapsUrl)
    expect(
      screen.getByRole("link", { name: /טלפון ישיר/ }),
    ).toHaveAttribute("href", CONTACT_DETAILS.phoneHref)
    expect(
      screen.getByRole("link", { name: /דואר אלקטרוני/ }),
    ).toHaveAttribute("href", `mailto:${CONTACT_DETAILS.email}`)
  })

  it("renders the service area towns", () => {
    render(<ContactDetails />)

    expect(screen.getByText("אזור שירות")).toBeInTheDocument()
    expect(
      screen.getByText(heMessages.ServiceArea.towns.join(", ")),
    ).toBeInTheDocument()
  })
})
