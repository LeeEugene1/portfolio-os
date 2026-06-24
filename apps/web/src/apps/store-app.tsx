"use client";

import { useStoreView } from "@/stores/cart-selectors";
import { CartPage } from "@/apps/store/cart-page";
import { CheckoutPage } from "@/apps/store/checkout-page";
import { OptionDialog } from "@/apps/store/option-dialog";
import { ProductList } from "@/apps/store/product-list";
import { StoreHeader } from "@/apps/store/store-header";

export function StoreApp() {
  const view = useStoreView();

  return (
    <div className="app-content store-app">
      <StoreHeader />
      {view === "products" && <ProductList />}
      {view === "cart" && <CartPage />}
      {view === "checkout" && <CheckoutPage />}
      <OptionDialog />
    </div>
  );
}
