import { expect, test } from "@playwright/test";

test("starter landing page renders in Indonesian", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Admin commerce yang clean/i }),
  ).toBeVisible();
});

test("unknown route renders not found", async ({ page }) => {
  const response = await page.goto("/unknown-route");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: /Halaman tidak ditemukan/i }),
  ).toBeVisible();
});

test("dashboard renders with starter bypass session", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: /Overview/i }),
  ).toBeVisible();
});

test("orders page renders dummy order management", async ({ page }) => {
  await page.goto("/dashboard/orders");
  await expect(page.getByRole("heading", { name: /^Orders$/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Order List/i })).toBeVisible();
});

test("products page supports dummy CRUD flow", async ({ page }) => {
  await page.goto("/dashboard/products");
  await expect(page.getByRole("heading", { name: /^Products$/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Product Catalog/i })).toBeVisible();
  await expect(page.getByTestId("products-shell")).toHaveAttribute("data-hydrated", "true");

  await page.getByRole("button", { name: /New product/i }).click();
  await expect(page.getByRole("heading", { name: /Add Product/i })).toBeVisible();
  await page.getByPlaceholder("Luna Knit Sweater").fill("Test Product");
  await page.getByPlaceholder("LKS-302").fill("TST-001");
  await page.getByRole("button", { name: /^Add product$/i }).click();
  await expect(page.getByText("Product added successfully.")).toBeVisible();
  await expect(page.getByText("Test Product")).toBeVisible();

  await page.getByRole("button", { name: /Delete Test Product/i }).click();
  await expect(page.getByRole("heading", { name: /Delete product/i })).toBeVisible();
  await page.getByRole("button", { name: /^Delete product$/i }).click();
  await expect(page.getByText("Test Product deleted.")).toBeVisible();
});

test("profile and settings pages render", async ({ page }) => {
  await page.goto("/dashboard/profile");
  await expect(page.getByRole("heading", { name: /Admin Ganipedia/i })).toBeVisible();

  await page.goto("/dashboard/settings");
  await expect(page.getByRole("heading", { name: /Store Settings/i })).toBeVisible();
});

test("health endpoint responds successfully", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
});
