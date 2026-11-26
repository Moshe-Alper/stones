import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
import Hero from "./Hero"

describe("Hero", () => {
  it("renders the single-line heading without a subheading paragraph", () => {
    const { container } = render(<Hero />)
    expect(
      screen.getByRole("heading", { name: "מצבות בעבודת יד, לזכר יקיריכם" }),
    ).toBeInTheDocument()
    expect(container.querySelector("p")).toBeNull()
  })

  it("shows the factory photo with descriptive alt text", () => {
    render(<Hero />)
    const image = screen.getByRole("img", { name: "חצר המפעל של שיש אלפר בפרדס חנה" })
    expect(image.getAttribute("src")).toContain("factory-yard.jpg")
  })

  it("links the primary CTA to the recent-work section", () => {
    render(<Hero />)
    expect(screen.getByRole("link", { name: "לצפייה בעבודות" })).toHaveAttribute("href", "#works")
  })

  it("links the secondary CTA to the contact page", () => {
    render(<Hero />)
    expect(screen.getByRole("link", { name: "דברו איתנו" })).toHaveAttribute("href", "/contact")
  })
})
