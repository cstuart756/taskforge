import { test, expect } from "@playwright/test";

test("homepage loads and shows the hero", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /simple task management/i })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: /get started/i }).first()
  ).toBeVisible();
});