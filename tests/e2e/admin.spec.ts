import { expect, test } from "@playwright/test";

/**
 * Needs a live API with a seeded admin and a normal user. Set E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_EMAIL and
 * E2E_PASSWORD; skipped otherwise.
 */
const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const userEmail = process.env.E2E_EMAIL;
const userPassword = process.env.E2E_PASSWORD;

test.skip(!adminEmail || !adminPassword || !userEmail || !userPassword, "needs admin and user credentials");

async function signIn(page: import("@playwright/test").Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).first().fill(password);
  await page.getByRole("button", { name: /masuk|login/i }).first().click();
}

test("admin lands in the admin area, not the planner dashboard", async ({ page }) => {
  await signIn(page, adminEmail ?? "", adminPassword ?? "");
  await page.waitForURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: /Ringkasan Platform/ })).toBeVisible();

  await page.getByRole("link", { name: /Paket/ }).first().click();
  await expect(page.getByRole("heading", { name: "Paket", exact: true })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Journey", exact: true })).toBeVisible();

  await page.getByRole("link", { name: /Pengguna/ }).first().click();
  await expect(page.getByRole("cell", { name: adminEmail ?? "" })).toBeVisible();
});

test("a normal user is sent away from /admin and cannot call the admin proxy", async ({ page }) => {
  await signIn(page, userEmail ?? "", userPassword ?? "");
  await page.waitForURL(/\/dashboard/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/dashboard/);
  const response = await page.request.get("/api/admin/users");
  expect(response.status()).toBe(403);
  expect((await page.request.get("/api/backend/admin/users")).status()).toBe(404);
});
