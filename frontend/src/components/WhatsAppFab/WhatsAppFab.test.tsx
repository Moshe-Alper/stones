import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
import WhatsAppFab from "./WhatsAppFab"

describe("WhatsAppFab", () => {
  it("links to the business WhatsApp chat with an accessible label", () => {
    render(<WhatsAppFab />)
    const link = screen.getByRole("link", { name: "שלחו לנו הודעה בוואטסאפ" })
    expect(link).toHaveAttribute("href", "https://wa.me/972505282431")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })
})
