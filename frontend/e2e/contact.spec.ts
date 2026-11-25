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
        name: "ייעוץ אישי ומקצועי",
      }),
    ).toBeVisible()
    await expect(page.getByLabel("שם מלא")).toBeVisible()
    await expect(
      page.getByTitle("מפת מיקום המפעל"),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { level: 2, name: "אחריות לדורות" }),
    ).toBeVisible()

    expect(consoleErrors).toEqual([])
  })

  test("submits an inquiry through the simulate delivery mode", async ({
    page,
  }) => {
    await page.goto("/contact")

    await page.getByLabel("שם מלא").fill("ישראל ישראלי")
    await page.getByLabel("מספר טלפון").fill("050-1234567")
    await page
      .getByLabel("הודעה / בקשה מיוחדת")
      .fill("אשמח לקבל פרטים על עיצוב אישי.")
    await page
      .getByRole("button", { name: "שליחת הבקשה" })
      .click()

    await expect(
      page.getByText("בקשתכם נשלחה בהצלחה. נחזור אליכם בהקדם."),
    ).toBeVisible()
  })

  test("shows a retryable message on delivery failure and allows resubmission", async ({
    page,
  }) => {
    let requestCount = 0
    await page.route("**/api/contact", async (route) => {
      requestCount += 1
      if (requestCount === 1) {
        await route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({
            error: {
              code: "CONTACT_DELIVERY_UNAVAILABLE",
              message:
                "לא הצלחנו לשלוח את הבקשה כעת. נסו שוב בעוד מספר דקות או צרו קשר טלפוני.",
            },
            requestId: "00000000-0000-0000-0000-000000000000",
          }),
        })
        return
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: { delivered: true, mode: "simulate" },
          requestId: "00000000-0000-0000-0000-000000000001",
        }),
      })
    })

    const consoleErrors: string[] = []
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text())
    })

    await page.goto("/contact")
    await page.getByLabel("שם מלא").fill("ישראל ישראלי")
    await page.getByLabel("מספר טלפון").fill("050-1234567")
    await page
      .getByLabel("הודעה / בקשה מיוחדת")
      .fill("אשמח לקבל פרטים על עיצוב אישי.")
    await page.getByRole("button", { name: "שליחת הבקשה" }).click()

    await expect(
      page.getByText(
        "לא הצלחנו לשלוח את הבקשה כעת. נסו שוב בעוד מספר דקות או צרו קשר טלפוני.",
      ),
    ).toBeVisible()
    await expect(page.getByLabel("שם מלא")).toHaveValue("ישראל ישראלי")

    await page.getByRole("button", { name: "שליחת הבקשה" }).click()

    await expect(
      page.getByText("בקשתכם נשלחה בהצלחה. נחזור אליכם בהקדם."),
    ).toBeVisible()
    expect(requestCount).toBe(2)

    for (const message of consoleErrors) {
      expect(message).not.toMatch(/RESEND_API_KEY|re_[a-zA-Z0-9]/)
    }
  })

  test("exposes direct contact paths but no commerce UI", async ({ page }) => {
    await page.goto("/contact")

    await expect(
      page.getByRole("link", { name: "התקשרו אלינו: 050-5282431" }).first(),
    ).toHaveAttribute("href", "tel:+972505282431")
    await expect(
      page.getByRole("main").getByRole("link", { name: "וואטסאפ" }),
    ).toHaveAttribute("href", "https://wa.me/972505282431")
    await expect(
      page.getByRole("link", { name: /דואר אלקטרוני/ }),
    ).toHaveAttribute("href", "mailto:moshe@alper-marble.co.il")
    await expect(
      page.getByText(/עגלה|לתשלום|checkout|cart|הוסף לסל/i),
    ).toHaveCount(0)
  })

  test("offers Google Maps and Waze navigation to the factory", async ({
    page,
  }) => {
    await page.goto("/contact")

    await expect(
      page.getByRole("link", { name: "ניווט למפעל במפות Google" }),
    ).toHaveAttribute("href", /^https:\/\/www\.google\.com\/maps\/dir\/\?/)
    await expect(
      page.getByRole("link", { name: "ניווט למפעל ב-Waze" }),
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
        name: "ייעוץ אישי ומקצועי",
      }),
    ).toBeVisible()
    await expect(page.getByLabel("שם מלא")).toBeVisible()
    await expect(
      page.getByRole("button", { name: "שליחת הבקשה" }),
    ).toBeVisible()
    await expect(
      page.getByTitle("מפת מיקום המפעל"),
    ).toBeVisible()
  })
})
