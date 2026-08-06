import { test, expect } from "@playwright/test";

test("shows a validation error for missing required fields, then submits successfully", async ({
  page,
}) => {
  await page.goto("/apply");
  await page.waitForSelector("text=Get your project considered");

  await page.locator("text=JOIN THE WAITLIST").click();
  await expect(page.getByText(/are required/)).toBeVisible();

  await page.locator('input[placeholder="What should we call it?"]').fill("E2E Test Project");
  await page
    .locator('input[placeholder="What does it do, in one sentence?"]')
    .fill("A project that only exists to prove the form works.");
  // Contact email is the 6th plain text input on the form.
  await page.locator('input[type="text"]').nth(6).fill("e2e@example.com");

  await page.locator("text=JOIN THE WAITLIST").click();
  await page.waitForSelector("text=YOU'RE ON THE WAITLIST");
  await expect(page.getByText("E2E Test Project is in for review")).toBeVisible();
});
