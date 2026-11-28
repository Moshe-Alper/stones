import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

// IS 5568 / WCAG AA automated check (.plan/024). Axe catches only part of WCAG;
// the manual audit in the plan covers the rest.
const PAGES = ["", "/catalog", "/catalog/hebron-marble", "/contact", "/about", "/accessibility", "/privacy"]
const LOCALE_PREFIXES = ["", "/en", "/ru"]

for (const prefix of LOCALE_PREFIXES) {
  for (const path of PAGES) {
    const url = `${prefix}${path}` || "/"

    test(`has no WCAG A/AA violations on ${url}`, async ({ page }) => {
      await page.goto(url)
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        // Google Maps iframe content is third-party (listed in the statement).
        .exclude("iframe")
        .analyze()

      const summary = results.violations.map(
        (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
      )
      expect(summary).toEqual([])
    })
  }
}

test("skip link moves keyboard focus to the main content", async ({ page }) => {
  await page.goto("/")
  await page.keyboard.press("Tab")
  const skipLink = page.locator("a[href='#main-content']")
  await expect(skipLink).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.locator("#main-content")).toBeFocused()
})

test("gallery lightbox traps focus and returns it on close", async ({ page }) => {
  await page.goto("/catalog/hebron-marble")
  const firstThumb = page.locator("ul button").first()
  await firstThumb.click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole("button").first()).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(dialog.locator(":focus")).toHaveCount(1)
  await page.keyboard.press("Escape")
  await expect(dialog).toHaveCount(0)
  await expect(firstThumb).toBeFocused()
})
