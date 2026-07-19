import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { CONTACT_DETAILS } from "@/data/contact"
import ContactMap from "./ContactMap"

describe("ContactMap", () => {
  it("shows the local map path and workshop context", () => {
    render(<ContactMap />)

    expect(
      screen.getByRole("img", { name: "מפת מיקום הסטודיו בחולון" }),
    ).toBeInTheDocument()
    expect(screen.getByText(CONTACT_DETAILS.hours)).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "ניווט לסטודיו במפות Google" }),
    ).toHaveAttribute("href", CONTACT_DETAILS.mapsUrl)
    expect(
      screen.getByRole("img", { name: "תמונת אווירה של בית המלאכה" }),
    ).toBeInTheDocument()
  })
})
