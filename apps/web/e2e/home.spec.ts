import { expect, test } from "@playwright/test";

test("renders the portfolio OS home screen", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Portfolio OS");
  await expect(
    page.getByRole("main", { name: "Portfolio OS desktop" }),
  ).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Portfolio" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open Store" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Running applications" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Dock Portfolio: focus" }),
  ).toBeVisible();
});

test("minimizes and restores windows from the dock", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Open Store" }).click();
  await expect(page.getByRole("dialog", { name: "Store" })).toBeVisible();

  await page.getByRole("button", { name: "Minimize Store" }).click();
  await expect(page.getByRole("dialog", { name: "Store" })).toBeHidden();

  await page.getByRole("button", { name: "Dock Store: focus" }).click();
  await expect(page.getByRole("dialog", { name: "Store" })).toBeVisible();
});

test("fills the screen when a window is maximized on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Maximize Portfolio" }).click();

  await expect(page.getByRole("dialog", { name: "Portfolio" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Running applications" }),
  ).toBeHidden();
  await expect(
    page.getByRole("navigation", { name: "Mobile applications" }),
  ).toHaveCount(0);
  const box = await page.getByRole("dialog", { name: "Portfolio" }).boundingBox();

  expect(box).toMatchObject({
    x: 0,
    y: 0,
    width: 390,
    height: 844,
  });
});
