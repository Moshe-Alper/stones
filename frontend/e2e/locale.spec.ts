import { expect, test } from "@playwright/test"

test.describe("Default locale", () => {
  test.use({ locale: "en-US" })

  test("serves Hebrew at / even when the browser prefers English", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator("html")).toHaveAttribute("lang", "he")
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl")
  })

  test("still serves English when chosen explicitly via /en", async ({ page }) => {
    await page.goto("/en")
    await expect(page.locator("html")).toHaveAttribute("lang", "en")
  })

  test("returns to Hebrew at / after visiting /en", async ({ page }) => {
    await page.goto("/en")
    await page.goto("/")
    await expect(page.locator("html")).toHaveAttribute("lang", "he")
  })
})
