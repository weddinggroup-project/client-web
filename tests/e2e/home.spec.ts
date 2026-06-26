import { expect, test } from "@playwright/test";

test("starter landing page renders in Indonesian", async ({ page }) => {
  await page.goto("/id");
  await expect(
    page.getByRole("heading", { name: /Dari ide ke production/i }),
  ).toBeVisible();
});

test("english locale renders translated content", async ({ page }) => {
  await page.goto("/en");
  await expect(
    page.getByRole("heading", { name: /From idea to production/i }),
  ).toBeVisible();
});

test("dashboard redirects unauthenticated users to sign in", async ({ page }) => {
  await page.goto("/id/dashboard");
  await expect(page).toHaveURL(/\/id\/sign-in$/);
});

test("health endpoint responds successfully", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
});
