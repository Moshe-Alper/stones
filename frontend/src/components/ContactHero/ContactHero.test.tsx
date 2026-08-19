import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import ContactHero from "./ContactHero"

describe("ContactHero", () => {
  it("introduces the personal consultation page", () => {
    render(<ContactHero />)

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "ייעוץ אישי ומקצועי",
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/אנו כאן כדי ללוות אתכם ברגעים הרגישים ביותר/),
    ).toBeInTheDocument()
  })
})
