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
    await expect(page.getByText("מציג 4 קטגוריות נבחרות")).toHaveCount(0);

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

  test("each category photo tile links to its gallery route", async ({ page }) => {
    await page.goto("/catalog");
    const main = page.getByRole("main");
    for (const category of CATEGORY_LINKS) {
      await expect(
        main.getByRole("link", { name: new RegExp(category.title) }).first()
      ).toHaveAttribute("href", category.href);
    }
  });

  test("ends with the phone and WhatsApp contact band", async ({ page }) => {
    await page.goto("/catalog");
    await expect(
      page.getByRole("main").getByRole("link", { name: "וואטסאפ" })
    ).toHaveAttribute("href", "https://wa.me/972505282431");
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

  test("offers the other stone types and a contact path", async ({ page }) => {
    await page.goto("/catalog/hebron-marble");
    const more = page.getByRole("region", { name: "סוגי אבן נוספים" });
    await expect(more.getByRole("link")).toHaveCount(3);
    await expect(more.getByRole("link", { name: /שיש חברוני/ })).toHaveCount(0);
    await expect(
      page.getByRole("main").getByRole("link", { name: "השאירו פרטים" })
    ).toHaveAttribute("href", "/contact");
  });

  test("style filter narrows the visible photos", async ({ page }) => {
    await page.goto("/catalog/hebron-marble");

    const thumbs = page.getByRole("button", { name: /הגדלת תמונה/ });
    const totalCount = await thumbs.count();

    await page.getByRole("button", { name: "קלאסי" }).click();
    const classicCount = await thumbs.count();

    expect(classicCount).toBeGreaterThan(0);
    expect(classicCount).toBeLessThanOrEqual(totalCount);

    await page.getByRole("button", { name: "הכל" }).click();
    await expect(thumbs).toHaveCount(totalCount);
  });
});
