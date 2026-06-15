import { expect, test } from "@playwright/test";

test("renders the portfolio OS home screen", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Portfolio OS");
  await expect(
    page.getByRole("heading", { name: "Portfolio OS" }),
  ).toBeVisible();
});
