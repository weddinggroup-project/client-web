import { expect, test } from "@playwright/test";

/**
 * Runs against a live API + client with a paid (or payment-gate-off) project. Set E2E_EMAIL, E2E_PASSWORD and
 * E2E_PROJECT_ID; the tests are skipped otherwise so CI without a backend stays green.
 */
const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;
const projectId = process.env.E2E_PROJECT_ID;

test.skip(!email || !password || !projectId, "needs E2E_EMAIL, E2E_PASSWORD, E2E_PROJECT_ID");

test.beforeEach(async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel(/email/i).fill(email ?? "");
  await page.getByLabel(/password/i).first().fill(password ?? "");
  await page.getByRole("button", { name: /masuk|login/i }).first().click();
  await page.waitForURL(/\/dashboard/);
});

test("home shows the countdown pill and stats", async ({ page }) => {
  await page.goto(`/dashboard/${projectId}`);
  await expect(page.getByText(/Hari Menuju Akad & Resepsi/)).toBeVisible();
  await expect(page.getByText(/Anggaran Biaya/i).first()).toBeVisible();
});

test("budget lists items from the API and creates a new one", async ({ page }) => {
  await page.goto(`/dashboard/${projectId}/budget`);
  await expect(page.getByRole("heading", { name: /Rencana Anggaran/ })).toBeVisible();

  const name = `Dekorasi ${Date.now()}`;
  await page.getByRole("button", { name: /Tambah pos anggaran/i }).click();
  await page.getByLabel(/Nama pos/).fill(name);
  await page.getByLabel(/Estimasi/).fill("12.000.000");
  await page.getByRole("button", { name: "Simpan" }).click();
  // The list is paginated, so confirm via the success toast rather than by finding the new row on page 1.
  await expect(page.getByText(/pos anggaran ditambahkan/i)).toBeVisible();
});

test("guest list shows seeded guest and validates required fields", async ({ page }) => {
  await page.goto(`/dashboard/${projectId}/tamu`);
  await expect(page.getByText("Budi Santoso").first()).toBeVisible();
  await page.getByRole("button", { name: /Tambah tamu/i }).click();
  await page.getByRole("button", { name: "Simpan" }).click();
  await expect(page.getByText(/Nama lengkap wajib diisi/)).toBeVisible();
});

test("sidebar navigates between modules", async ({ page }) => {
  await page.goto(`/dashboard/${projectId}`);
  await page.getByRole("link", { name: /Checklist/ }).first().click();
  await expect(page).toHaveURL(/\/checklist$/);
  await expect(page.getByRole("heading", { name: /Checklist Persiapan Pernikahan/ })).toBeVisible();
});

test("order wizard shows the packages and prices served by the API", async ({ page }) => {
  await page.goto("/undangan-digital/pesan");
  await expect(page.getByRole("heading", { name: "Journey" })).toBeVisible();
  await expect(page.getByText("Rp. 350.000")).toBeVisible();
  await expect(page.getByText("Terpopuler")).toBeVisible();
});
