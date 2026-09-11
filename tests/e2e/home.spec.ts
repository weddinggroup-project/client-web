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

test("dashboard renders with starter bypass session", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: /Overview/i }),
  ).toBeVisible();
});

test("orders page renders dummy order management", async ({ page }) => {
  await page.goto("/dashboard/orders");
  await expect(page.getByRole("heading", { name: /^Orders$/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Daftar Pesanan/i })).toBeVisible();
});

test("products page supports dummy CRUD flow", async ({ page }) => {
  await page.goto("/dashboard/products");
  await expect(page.getByRole("heading", { name: /^Products$/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Katalog Template/i })).toBeVisible();
  await expect(page.getByTestId("products-shell")).toHaveAttribute("data-hydrated", "true");

  await page.getByRole("button", { name: /Template baru/i }).click();
  await expect(page.getByRole("heading", { name: /Tambah Template/i })).toBeVisible();
  await page.getByPlaceholder("Blush Elegance").fill("Test Template");
  await page.getByPlaceholder("BLE-001").fill("TST-001");
  await page.getByRole("button", { name: /^Tambah template$/i }).click();
  await expect(page.getByText("Template berhasil ditambahkan.")).toBeVisible();
  await expect(page.getByText("Test Template")).toBeVisible();

  await page.getByRole("button", { name: /Delete Test Template/i }).click();
  await expect(page.getByRole("heading", { name: /Hapus template\?/i })).toBeVisible();
  await page.getByRole("button", { name: /^Hapus template$/i }).click();
  await expect(page.getByText("Test Template dihapus.")).toBeVisible();
});

test("profile and settings pages render", async ({ page }) => {
  await page.goto("/dashboard/profile");
  await expect(page.getByRole("heading", { name: /Admin Vowly/i })).toBeVisible();

  await page.goto("/dashboard/settings");
  await expect(page.getByRole("heading", { name: /Pengaturan Platform/i })).toBeVisible();
});

test("health endpoint responds successfully", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
});
