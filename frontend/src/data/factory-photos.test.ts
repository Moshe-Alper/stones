import { describe, expect, it } from "vitest"
import { getFactoryPhotoSrc } from "./factory-photos"

describe("getFactoryPhotoSrc", () => {
  it("returns null when the photo has not been supplied yet", () => {
    expect(getFactoryPhotoSrc({ id: "truck" })).toBeNull()
  })

  it("resolves a supplied photo under /images/factory", () => {
    expect(getFactoryPhotoSrc({ id: "truck", file: "truck.jpg" })).toBe("/images/factory/truck.jpg")
  })
})
