import { expect, test } from "@playwright/test"

test.describe("Contact page", () => {
  test("loads the complete RTL contact experience without console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = []
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text())
    })
    page.on("pageerror", (error) => consoleErrors.push(error.message))

    await page.goto("/contact")

    await expect(page.locator("html")).toHaveAttribute("lang", "he")
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl")
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "ייעוץ אישי מהמשפחה שלנו",
      }),
    ).toBeVisible()
    await expect(page.getByLabel("שם מלא")).toBeVisible()
    await expect(
      page.getByTitle("מפת מיקום הסטודיו"),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { level: 2, name: "אחריות לדורות" }),
    ).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test("submits an inquiry through the simulated local delivery path", async ({
    page,
  }) => {
    await page.goto("/contact")

    await page.getByLabel("שם מלא").fill("ישראל ישראלי")
    await page.getByLabel("מספר טלפון").fill("050-1234567")
    await page
      .getByLabel("הודעה / בקשה מיוחדת")
      .fill("אשמח לקבל פרטים על עיצוב אישי.")
    await page
      .getByRole("button", { name: "שליחת בקשה למשפחה" })
      .click()

    await expect(
      page.getByText("בקשתכם נשלחה למשפחה. נחזור אליכם בהקדם."),
    ).toBeVisible()
  })

  test("exposes direct contact paths but no commerce UI", async ({ page }) => {
    await page.goto("/contact")

    await expect(page.getByRole("link", { name: /טלפון ישיר/ })).toHaveAttribute(
      "href",
      "tel:+97235558291",
    )
    await expect(
      page.getByRole("link", { name: /דואר אלקטרוני/ }),
    ).toHaveAttribute("href", "mailto:dovalper16@gmail.com")
    await expect(
      page.getByText(/עגלה|לתשלום|checkout|cart|הוסף לסל/i),
    ).toHaveCount(0)
  })

  test("offers Google Maps and Waze navigation to the studio", async ({
    page,
  }) => {
    await page.goto("/contact")

    await expect(
      page.getByRole("link", { name: "ניווט לסטודיו במפות Google" }),
    ).toHaveAttribute("href", /^https:\/\/www\.google\.com\/maps\/dir\/\?/)
    await expect(
      page.getByRole("link", { name: "ניווט לסטודיו ב-Waze" }),
    ).toHaveAttribute("href", /^https:\/\/waze\.com\/ul\?/)
  })

  test("keeps the primary contact path usable on a mobile viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/contact")

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "ייעוץ אישי מהמשפחה שלנו",
      }),
    ).toBeVisible()
    await expect(page.getByLabel("שם מלא")).toBeVisible()
    await expect(
      page.getByRole("button", { name: "שליחת בקשה למשפחה" }),
    ).toBeVisible()
    await expect(
      page.getByTitle("מפת מיקום הסטודיו"),
    ).toBeVisible()
  })
})
