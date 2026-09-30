import { test, expect } from "@playwright/test";
import {
  makeTestUser,
  registerUser,
  logoutUser,
} from "./helpers/test-user";

test.describe("Authentication", () => {
  test("registers a new user and lands on the dashboard", async ({
    page,
  }) => {
    const user = makeTestUser("register");
    await registerUser(page, user);

    await expect(
      page.getByRole("heading", { name: /welcome to taskforge/i })
    ).toBeVisible();

    await expect(page.getByText(user.email)).toBeVisible();
  });

  test("logs in with valid credentials", async ({ page }) => {
    const user = makeTestUser("login");
    await registerUser(page, user);
    await logoutUser(page);

    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: /^log in$/i }).click();

    await page.waitForURL("**/app", { timeout: 15000 });
    await expect(page.getByText(user.email)).toBeVisible();
  });

  test("rejects a wrong password", async ({ page }) => {
    const user = makeTestUser("wrongpass");
    await registerUser(page, user);
    await logoutUser(page);

    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill("definitely-wrong-password");
    await page.getByRole("button", { name: /^log in$/i }).click();

    await expect(
      page.getByText(/invalid email or password/i)
    ).toBeVisible({ timeout: 10000 });

    await expect(page).toHaveURL(/\/login/);
  });

  test("redirects unauthenticated users from /app to /login", async ({
    page,
  }) => {
    await page.goto("/app");

    await page.waitForURL(/\/login/, { timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: /welcome back/i })
    ).toBeVisible();
  });
});