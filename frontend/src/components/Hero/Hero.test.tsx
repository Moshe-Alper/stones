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

  it("shows a captioned placeholder for the factory-front photo until it is supplied", () => {
    render(<Hero />)
    expect(screen.getByRole("img", { name: "חזית המפעל עם השלט" })).toBeInTheDocument()
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
