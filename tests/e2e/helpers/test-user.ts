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

export type TestTask = {
  title: string;
  description?: string;
  priority?: "LOW" | "NORMAL" | "HIGH";
};

export async function createTeam(
  page: Page,
  teamName: string
): Promise<string> {
  await page.goto("/app/teams/new");
  await page.getByLabel("Team name").fill(teamName);
  await page.getByRole("button", { name: /create team/i }).click();

  // Wait for redirect to a specific team page (not the /new form)
  await page.waitForURL(
    (url) => {
      const path = url.pathname;
      return (
        path.startsWith("/app/teams/") &&
        path !== "/app/teams/new" &&
        /^\/app\/teams\/[a-z0-9-]+$/.test(path)
      );
    },
    { timeout: 15000 }
  );

  const url = page.url();
  const slug = url.split("/").pop();
  if (!slug || slug === "new") {
    throw new Error(`Could not extract valid slug from URL: ${url}`);
  }
  return slug;
}

export async function createTask(
  page: Page,
  teamSlug: string,
  task: TestTask
): Promise<void> {
  await page.goto(`/app/teams/${teamSlug}/tasks/new`);
  await page.getByLabel("Title").fill(task.title);

  if (task.description) {
    await page.getByLabel("Description").fill(task.description);
  }

  if (task.priority) {
    await page.getByLabel("Priority").selectOption(task.priority);
  }

  await page.getByRole("button", { name: /create task/i }).click();
  await page.waitForURL(`/app/teams/${teamSlug}`, { timeout: 15000 });
}
