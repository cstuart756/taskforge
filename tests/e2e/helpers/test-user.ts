import type { Page } from "@playwright/test";

export function uniqueEmail(prefix = "test"): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}-${timestamp}-${random}@example.com`;
}

export type TestUser = {
  name: string;
  email: string;
  password: string;
};

export function makeTestUser(prefix = "test"): TestUser {
  return {
    name: `Playwright User ${Date.now()}`,
    email: uniqueEmail(prefix),
    password: "playwright-password-123",
  };
}

export async function registerUser(
  page: Page,
  user: TestUser
): Promise<void> {
  await page.goto("/register");
  await page.getByLabel("Name").fill(user.name);
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: /create account/i }).click();

  await page.waitForURL("**/app", { timeout: 15000 });
}

export async function logoutUser(page: Page): Promise<void> {
  await page.getByRole("button", { name: /log out/i }).click();
  await page.waitForURL("**/login", { timeout: 10000 });
}