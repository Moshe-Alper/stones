import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { SERVICE_AREA } from "@/data/contact"
import ServiceArea from "./ServiceArea"

describe("ServiceArea", () => {
  it("renders the service area summary and each town", () => {
    render(<ServiceArea />)

    expect(screen.getByText(SERVICE_AREA.summary)).toBeInTheDocument()
    for (const town of SERVICE_AREA.towns) {
      expect(screen.getByText(town)).toBeInTheDocument()
    }
  })
})
