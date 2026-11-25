import { describe, expect, it } from "vitest"
import { CATEGORIES } from "./categories"
import he from "../../messages/he.json"
import en from "../../messages/en.json"
import ru from "../../messages/ru.json"

type Sections = { title: string; text: string }[]

describe("category 'about this stone' sections", () => {
  it.each([
    ["he", he],
    ["en", en],
    ["ru", ru],
  ])("every catalog category has 4 non-empty sections in %s", (_locale, messages) => {
    for (const { slug } of CATEGORIES) {
      const sections = (messages.Categories as Record<string, { sections: Sections }>)[slug].sections
      expect(sections).toHaveLength(4)
      sections.forEach((section) => {
        expect(section.title.trim()).not.toBe("")
        expect(section.text.trim()).not.toBe("")
      })
    }
  })

  it("mentions Galilean dolomite in the special category", () => {
    expect(he.Categories.special.sections.map((s) => s.text).join(" ")).toContain("דולמיט גלילי")
  })
})
