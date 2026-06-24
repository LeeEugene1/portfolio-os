import { ShoppingBag } from "lucide-react";
import { useCartSummary, useStoreView } from "@/stores/cart-selectors";
import { useCartStore } from "@/stores/cart-store";

export function StoreHeader() {
  const view = useStoreView();
  const summary = useCartSummary();
  const openCart = useCartStore((state) => state.openCart);

  return (
    <header className="store-header">
      <div>
        <p className="eyebrow">Store</p>
        <h2>
          {view === "products" && "Mini storefront"}
          {view === "cart" && "장바구니"}
          {view === "checkout" && "결제하기"}
        </h2>
      </div>
      <button
        aria-label="Open cart page"
        className="store-cart-button"
        type="button"
        onClick={openCart}
      >
        <ShoppingBag size={18} />
        <output aria-label="Cart item count">{summary.itemCount}</output>
      </button>
    </header>
  );
}
