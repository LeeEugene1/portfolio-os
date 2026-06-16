import { expect, test } from "@playwright/test";

test("renders the portfolio OS home screen", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Portfolio OS");
  await expect(
    page.getByRole("main", { name: "Portfolio OS desktop" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Portfolio" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open Store" })).toBeVisible();
});
