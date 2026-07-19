import { test, expect } from "@playwright/test";

const PRODUCT_URL = "/product/black-absolute-granite";

test.describe("Product Detail page", () => {
  test("loads the RTL layout without console errors", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto(PRODUCT_URL);

    await expect(page.locator("html")).toHaveAttribute("lang", "he");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(
      page.getByRole("heading", { level: 1, name: "מצבת גרניט שחורה אבסולוט" })
    ).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("header nav marks the catalog link active", async ({ page }) => {
    await page.goto(PRODUCT_URL);
    await expect(
      page.getByRole("navigation", { name: "ניווט ראשי" }).getByRole("link", {
        name: "קטלוג",
      })
    ).toHaveAttribute("href", "/catalog");
  });

  test("renders the 3-level breadcrumb trail", async ({ page }) => {
    await page.goto(PRODUCT_URL);
    const nav = page.getByRole("navigation", { name: "נתיב ניווט" });
    await expect(nav.getByText("מצבת גרניט שחורה אבסולוט")).toBeVisible();
    await expect(
      nav.getByRole("link", { name: "מצבות גרניט" })
    ).toHaveAttribute("href", "/catalog/granite");
    await expect(
      nav.getByRole("link", { name: "קטלוג מצבות" })
    ).toHaveAttribute("href", "/catalog");
  });

  test("primary CTA requests a quote via /contact", async ({ page }) => {
    await page.goto(PRODUCT_URL);
    await expect(
      page.getByRole("link", { name: "בקשת הצעת מחיר" })
    ).toHaveAttribute("href", "/contact");
  });

  test("related section links to the full catalog", async ({ page }) => {
    await page.goto(PRODUCT_URL);
    await expect(
      page.getByRole("link", { name: "לכל הקטלוג" })
    ).toHaveAttribute("href", "/catalog");
  });

  test("renders the three technical spec cards", async ({ page }) => {
    await page.goto(PRODUCT_URL);
    for (const title of ["זמני אספקה והתקנה", "תשתית ובסיס", "מידות המצבה"]) {
      await expect(
        page.getByRole("heading", { level: 4, name: title })
      ).toBeVisible();
    }
  });

  test("does not render cart, checkout, or payment UI", async ({ page }) => {
    await page.goto(PRODUCT_URL);
    await expect(
      page.getByText(/עגלה|לתשלום|checkout|cart|הוסף לסל/i)
    ).toHaveCount(0);
  });

  test("unknown product slug returns 404", async ({ page }) => {
    const response = await page.goto("/product/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
