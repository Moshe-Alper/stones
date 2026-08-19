import { test, expect } from "@playwright/test";

const CATEGORY_LINKS = [
  { title: "שיש טורקי", href: "/catalog/turkish-marble" },
  { title: "שיש חברוני", href: "/catalog/hebron-marble" },
  { title: "מצבות אבן גרניט", href: "/catalog/granite" },
  { title: "מצבות מיוחדות", href: "/catalog/special" },
];

test.describe("Catalog page", () => {
  test("loads without console errors and renders the RTL catalog layout", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });

    await page.goto("/catalog");

    await expect(page.locator("html")).toHaveAttribute("lang", "he");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(
      page.getByRole("heading", { level: 1, name: "קטלוג דגמים" })
    ).toBeVisible();
    await expect(page.getByText("מציג 4 קטגוריות נבחרות")).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("header nav shows the catalog link", async ({ page }) => {
    await page.goto("/catalog");
    await expect(
      page.getByRole("navigation", { name: "ניווט ראשי" }).getByRole("link", {
        name: "קטלוג",
      })
    ).toHaveAttribute("href", "/catalog");
  });

  test("each category card links to its gallery route", async ({ page }) => {
    await page.goto("/catalog");
    for (const category of CATEGORY_LINKS) {
      const card = page.getByRole("article").filter({
        has: page.getByRole("heading", { level: 3, name: category.title }),
      });
      await expect(
        card.getByRole("link", { name: "לצפייה בגלריה" })
      ).toHaveAttribute("href", category.href);
    }
  });

  test("category card routes resolve without 404", async ({ page }) => {
    const response = await page.goto("/catalog/turkish-marble");
    expect(response?.status()).toBeLessThan(400);
    await expect(
      page.getByRole("heading", { level: 1, name: "שיש טורקי" })
    ).toBeVisible();
  });

  test("breadcrumb links back home", async ({ page }) => {
    await page.goto("/catalog");
    await expect(
      page.getByRole("navigation", { name: "נתיב ניווט" }).getByRole("link", {
        name: "בית",
      })
    ).toHaveAttribute("href", "/");
  });

  test("does not render cart, checkout, or payment UI", async ({ page }) => {
    await page.goto("/catalog");
    await expect(page.getByText(/עגלה|תשלום|לתשלום|checkout|cart/i)).toHaveCount(
      0
    );
  });
});

test.describe("Catalog category gallery", () => {
  test("shows real installation photos and a working lightbox", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/catalog/turkish-marble");

    const thumbs = page.getByRole("button", { name: /הגדלת תמונה/ });
    await expect(thumbs.first()).toBeVisible();
    expect(await thumbs.count()).toBeGreaterThan(0);

    await thumbs.first().click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("button", { name: "סגירה" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    expect(consoleErrors).toEqual([]);
  });

  test("has a consultation CTA linking to Contact", async ({ page }) => {
    await page.goto("/catalog/hebron-marble");
    await expect(
      page.getByRole("main").getByRole("link", { name: "בקשת ייעוץ" })
    ).toHaveAttribute("href", "/contact");
  });
});
