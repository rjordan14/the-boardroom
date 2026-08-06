import { test, expect } from "@playwright/test";

test("admin sends an invite and the generated link opens a working portal onboarding", async ({
  page,
  context,
}) => {
  await page.goto("/admin");
  await page.waitForSelector("text=ADMIN ACCESS");
  await page.locator("text=CONNECT WALLET").click();
  await page.waitForSelector("text=RECENT ACTIVITY");

  await page.locator('a[href="/admin/projects"]').click();
  await page.waitForSelector("text=SEND INVITE");
  await page.locator('input[placeholder*="project@email"]').fill("e2e-test@example.com");
  await page.locator("text=SEND INVITE").click();
  await page.waitForSelector("text=PREVIEW AS PROJECT");

  const [portalPage] = await Promise.all([
    context.waitForEvent("page"),
    page.locator('a:has-text("PREVIEW AS PROJECT")').click(),
  ]);

  await portalPage.waitForSelector("text=You've been invited to join Season 01");
  await portalPage.locator("text=CONNECT WALLET").click();
  await portalPage.waitForSelector("text=CLAIM YOUR INVITE");

  await portalPage.locator('input[placeholder="e.g. LEDGERBOY"]').fill("E2E TEST PROJECT");
  await portalPage.locator("text=ENTER PORTAL").click();
  await portalPage.waitForSelector("text=SETUP CHECKLIST");

  // Answer a Q&A question and confirm it shows as answered.
  await portalPage.locator('a[href="/portal/qa"]').click();
  await portalPage.waitForSelector("text=QUESTIONS FROM THE FLOOR");
  await portalPage.locator("text=REPLY →").first().click();
  await portalPage.locator("textarea").fill("Answered from the E2E suite.");
  await portalPage.locator("text=POST ANSWER").click();
  await expect(portalPage.getByText("Answered from the E2E suite.")).toBeVisible();
});
