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
      page.getByRole("heading", { name: "כיבוד זיכרון יקיריכם בכבוד ובעדינות" })
    ).toBeVisible()

    expect(consoleErrors).toEqual([]);
  });

  test("header nav links point to the expected hrefs", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "בקשת ייעוץ" })).toHaveAttribute(
      "href",
      "/contact"
    );
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "קטלוג" })
    ).toHaveAttribute("href", "/catalog");
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "בית" })
    ).toHaveAttribute("href", "/");
  });

  test("hero CTAs point to the catalog and brand-story anchor", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "לצפייה בקטלוג" })).toHaveAttribute(
      "href",
      "/catalog"
    );
    await expect(page.getByRole("link", { name: "סיפור המותג" })).toHaveAttribute(
      "href",
      "#brand-story"
    );
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
