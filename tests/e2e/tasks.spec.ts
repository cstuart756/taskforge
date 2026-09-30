import { test, expect } from "@playwright/test";
import {
  makeTestUser,
  registerUser,
  createTeam,
  createTask,
  type TestUser,
} from "./helpers/test-user";

test.describe.configure({ mode: "serial" });

test.describe("Task and team flows", () => {
  let user: TestUser;
  let teamSlug: string;
  const teamName = `E2E Team ${Date.now()}`;
  const taskTitle = `E2E Task ${Date.now()}`;

  test.beforeAll(async ({ browser }) => {
    user = makeTestUser("taskflow");
    const page = await browser.newPage();

    // Register the user
    await registerUser(page, user);

    // Create the team
    teamSlug = await createTeam(page, teamName);

    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: /^log in$/i }).click();
    await page.waitForURL("**/app", { timeout: 15000 });
  });

  test("the team exists and shows the team name", async ({ page }) => {
    await page.goto(`/app/teams/${teamSlug}`);

    await expect(
      page.getByText(teamName, { exact: false }).first()
    ).toBeVisible();
  });

  test("creates a task in the team", async ({ page }) => {
    await createTask(page, teamSlug, {
      title: taskTitle,
      description: "Created by Playwright",
      priority: "HIGH",
    });

    await expect(page.getByText(taskTitle)).toBeVisible();
    await expect(page.getByText(/high/i).first()).toBeVisible();
  });

  test("marks the task complete", async ({ page }) => {
    await page.goto(`/app/teams/${teamSlug}`);
    await page.getByText(taskTitle).click();
    await page.waitForURL(/\/app\/tasks\/[a-z0-9]+/, { timeout: 10000 });

    await page.getByRole("button", { name: /mark complete/i }).click();

    await expect(
      page.getByText(/done/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("finds the task in the all-tasks list", async ({ page }) => {
    await page.goto("/app/tasks");
    await expect(page.getByText(taskTitle)).toBeVisible();
  });

  test("deletes the task", async ({ page }) => {
    await page.goto(`/app/teams/${teamSlug}`);
    await page.getByText(taskTitle).click();
    await page.waitForURL(/\/app\/tasks\/[a-z0-9]+/, { timeout: 10000 });

    page.on("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: /^delete$/i }).click();

    await page.waitForURL(`/app/teams/${teamSlug}`, { timeout: 15000 });
    await expect(page.getByText(taskTitle)).not.toBeVisible();
  });
});