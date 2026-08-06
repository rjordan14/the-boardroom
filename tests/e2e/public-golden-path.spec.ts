import { test, expect } from "@playwright/test";

test("lobby -> room -> compare -> ballot -> sealed", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector("text=THE COMMUNITY DECIDES");

  await page.locator('a:has-text("CLOCK IN TO VOTE"):visible').first().click();
  await expect(page).toHaveURL(/\/room\/01$/);

  // Skip the door entrance if it's showing, then watch pitch A to completion.
  await page.locator("text=SKIP ENTRANCE").click().catch(() => {});
  await page.waitForSelector("text=PITCH COMPLETE", { timeout: 12_000 });

  // Advance to pitch B and watch it too.
  await page.locator("text=NEXT PITCH").click();
  await page.locator("text=SKIP ENTRANCE").click().catch(() => {});
  await page.waitForSelector("text=PITCH COMPLETE", { timeout: 12_000 });

  await page.locator("text=COMPARE & VOTE").click();
  await expect(page).toHaveURL(/\/room\/01\/compare$/);
  await page.waitForSelector("text=BOTH PITCHES WATCHED");

  await page.locator("text=LEDGERBOY").first().click();
  await page.locator("text=CLOCK IN · CAST BALLOT").click();

  // Ceremony: sign -> stamp -> eject -> auto-navigate to sealed.
  await expect(page).toHaveURL(/\/room\/01\/sealed$/, { timeout: 8_000 });
  await page.waitForSelector("text=YOUR VOTE IS CLOCKED IN");
  await expect(page.getByText("LEDGERBOY").first()).toBeVisible();

  // Backing panel: pick a preset, escrow, confirm the receipt state.
  await page.getByRole("button", { name: "888" }).click();
  await page.getByRole("button", { name: /^ESCROW/ }).click();
  await page.waitForSelector("text=YOU'RE IN FOR");
});
