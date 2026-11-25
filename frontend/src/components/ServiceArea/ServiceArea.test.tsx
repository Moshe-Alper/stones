import { screen } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
import { describe, expect, it } from "vitest"
import heMessages from "../../../messages/he.json"
import ServiceArea from "./ServiceArea"

describe("ServiceArea", () => {
  it("renders the service area summary and each town", () => {
    render(<ServiceArea />)

    expect(screen.getByText(heMessages.ServiceArea.summary)).toBeInTheDocument()
    for (const town of heMessages.ServiceArea.towns) {
      expect(screen.getByText(town)).toBeInTheDocument()
    }
  })
})
