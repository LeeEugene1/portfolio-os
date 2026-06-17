import { expect, test } from "@playwright/test";

test("adds a product to the cart, persists it, and opens checkout", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Open Store" }).click();

  const storeWindow = page.getByRole("dialog", { name: "Store" });
  await expect(storeWindow).toBeVisible();

  await storeWindow
    .getByRole("button", {
      name: /Open \[바릴라\] 딸리아뗄레 파스타면 500g x 12팩.* option selector/,
    })
    .click();

  const optionSelector = page.getByRole("dialog", {
    name: "Option selector",
  });
  await expect(optionSelector).toBeVisible();

  await optionSelector
    .getByRole("button", {
      name: /Increase \[바릴라\] 딸리아뗄레 파스타면.* quantity/,
    })
    .click();

  await expect(page.getByLabel("Selected product total")).toHaveText("₩41,980");

  await optionSelector.getByRole("button", { name: "장바구니 담기" }).click();

  await expect(optionSelector).toBeHidden();
  await expect(storeWindow.getByLabel("Cart item count")).toHaveText("2");

  await storeWindow.getByRole("button", { name: "Open cart page" }).click();
  await expect(storeWindow.getByRole("region", { name: "Cart page" })).toBeVisible();
  await expect(storeWindow.getByLabel("Order total")).toHaveText("₩41,980");

  await page.reload();
  await page.getByRole("button", { name: "Open Store" }).click();

  const reloadedStoreWindow = page.getByRole("dialog", { name: "Store" });
  await reloadedStoreWindow.getByRole("button", { name: "Open cart page" }).click();
  await expect(reloadedStoreWindow.getByLabel("Cart item count")).toHaveText("2");
  await expect(reloadedStoreWindow.getByLabel("Order total")).toHaveText(
    "₩41,980",
  );

  await reloadedStoreWindow.getByRole("button", { name: "결제하기" }).click();

  await expect(
    reloadedStoreWindow.getByRole("region", { name: "Checkout page" }),
  ).toBeVisible();
  await expect(reloadedStoreWindow.getByText("MVP mock checkout")).toBeVisible();
});
