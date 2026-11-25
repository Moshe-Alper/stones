import { screen } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
import { describe, expect, it } from "vitest"
import TrustHighlights from "./TrustHighlights"

describe("TrustHighlights", () => {
  it("renders the three approved trust commitments", () => {
    render(<TrustHighlights />)

    for (const title of ["עיצוב אישי", "שקיפות מלאה", "אחריות לדורות"]) {
      expect(
        screen.getByRole("heading", { level: 2, name: title }),
      ).toBeInTheDocument()
    }
  })
})
