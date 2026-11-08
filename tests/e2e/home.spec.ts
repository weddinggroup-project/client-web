import { expect, test } from "@playwright/test";

test("landing page renders the Vowly hero", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Every Detail Tells Your Story/i }),
  ).toBeVisible();
});

test("unknown route renders not found", async ({ page }) => {
  const response = await page.goto("/unknown-route");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: /Halaman tidak ditemukan/i }),
  ).toBeVisible();
});

test("dashboard requires a session", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in\?next=%2Fdashboard/);
});
