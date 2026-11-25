import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads without console errors and renders RTL Hebrew layout", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });

    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "he");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(
      page.getByRole("heading", { name: "מצבות בעבודת יד, לזכר יקיריכם" })
    ).toBeVisible()

    expect(consoleErrors).toEqual([]);
  });

  test("header nav links point to the expected hrefs", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("navigation").getByRole("link", { name: "צור קשר" })).toHaveAttribute(
      "href",
      "/contact"
    );
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "קטלוג" })
    ).toHaveAttribute("href", "/catalog");
    await expect(
      page
        .getByRole("navigation")
        .getByRole("link", { name: "שיש אלפר, לעמוד הבית" })
    ).toHaveAttribute("href", "/");
  });

  test("hero CTAs point to recent work and the contact page", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "לצפייה בעבודות" })).toHaveAttribute(
      "href",
      "#works"
    );
    await expect(page.getByRole("link", { name: "דברו איתנו" })).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  test("shows the photo-first sections and no FAQ", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("#works img")).toHaveCount(8);
    await expect(page.getByRole("heading", { name: "בחרו סוג אבן" })).toBeVisible();
    await expect(page.getByRole("link", { name: "וואטסאפ" })).toHaveAttribute(
      "href",
      "https://wa.me/972505282431"
    );
    await expect(page.locator("#faq")).toHaveCount(0);
  });

  test("FAQ now lives on the contact page", async ({ page }) => {
    await page.goto("/contact#faq");
    await expect(page.getByRole("heading", { name: "שאלות נפוצות" })).toBeVisible();
  });

  test("catalog and contact routes resolve without 404", async ({ page }) => {
    const catalogResponse = await page.goto("/catalog");
    expect(catalogResponse?.status()).toBeLessThan(400);
    await expect(page.getByRole("heading", { name: "קטלוג" })).toBeVisible();

    const contactResponse = await page.goto("/contact");
    expect(contactResponse?.status()).toBeLessThan(400);
    await expect(
      page.getByRole("heading", { name: "ייעוץ אישי מהמשפחה שלנו" }),
    ).toBeVisible();
  });
});
