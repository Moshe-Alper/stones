import { describe, expect, it } from "vitest"
import { screen } from "@testing-library/react"
import { renderWithIntl as render } from "@/test/renderWithIntl"
import { getFeaturedPhotos } from "@/data/gallery"
import RecentWork from "./RecentWork"

describe("RecentWork", () => {
  it("renders the section heading with the #works anchor", () => {
    const { container } = render(<RecentWork />)
    expect(screen.getByRole("heading", { name: "עבודות אחרונות" })).toBeInTheDocument()
    expect(container.querySelector("section#works")).not.toBeNull()
  })

  it("renders one photo per featured gallery entry, linked to its category gallery", () => {
    render(<RecentWork />)
    const featured = getFeaturedPhotos()
    const images = screen.getAllByRole("img")
    expect(images).toHaveLength(featured.length)
    featured.forEach((photo, index) => {
      expect(images[index].closest("a")).toHaveAttribute("href", `/catalog/${photo.category}`)
    })
  })

  it("links to the full gallery", () => {
    render(<RecentWork />)
    expect(screen.getByRole("link", { name: /לכל הגלריה/ })).toHaveAttribute("href", "/catalog")
  })
})
