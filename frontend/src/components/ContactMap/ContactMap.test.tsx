import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CONTACT_DETAILS } from "@/data/contact"
import ContactMap from "./ContactMap"

describe("ContactMap", () => {
  it("embeds the real studio map and workshop context", () => {
    render(<ContactMap />)

    const frame = screen.getByTitle("מפת מיקום הסטודיו")
    expect(frame.tagName).toBe("IFRAME")
    expect(frame).toHaveAttribute("src", CONTACT_DETAILS.mapsEmbedUrl)

    expect(screen.getByText(CONTACT_DETAILS.hours)).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "ניווט לסטודיו במפות Google" }),
    ).toHaveAttribute("href", CONTACT_DETAILS.mapsUrl)
    expect(
      screen.getByRole("link", { name: "ניווט לסטודיו ב-Waze" }),
    ).toHaveAttribute("href", CONTACT_DETAILS.wazeUrl)
    expect(
      screen.getByRole("img", { name: "תמונת אווירה של בית המלאכה" }),
    ).toBeInTheDocument()
  })

  it("keeps the map inert until the visitor taps to activate it", () => {
    render(<ContactMap />)

    const frame = screen.getByTitle("מפת מיקום הסטודיו")
    expect(frame.className).not.toContain("mapFrameActive")

    const activateButton = screen.getByRole("button", {
      name: "הקש למפה אינטראקטיבית",
    })
    fireEvent.click(activateButton)

    expect(frame.className).toContain("mapFrameActive")
    expect(
      screen.queryByRole("button", { name: "הקש למפה אינטראקטיבית" }),
    ).not.toBeInTheDocument()
  })
})
