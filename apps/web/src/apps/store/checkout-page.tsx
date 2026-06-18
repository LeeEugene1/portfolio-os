import { ArrowLeft } from "lucide-react";
import { useCartLines } from "@/stores/cart-selectors";
import { useCartStore } from "@/stores/cart-store";
import { OrderSummary } from "@/apps/store/order-summary";
import { formatPrice } from "@/apps/store/store-format";

export function CheckoutPage() {
  const lines = useCartLines();
  const clearCart = useCartStore((state) => state.clearCart);
  const openCart = useCartStore((state) => state.openCart);
  const openProducts = useCartStore((state) => state.openProducts);

  function completeCheckout() {
    clearCart();
    openProducts();
  }

  return (
    <section className="store-page" aria-label="Checkout page">
      <button className="store-back-button" type="button" onClick={openCart}>
        <ArrowLeft size={16} />
        장바구니
      </button>
      {lines.length === 0 ? (
        <div className="empty-cart">
          <h3>결제할 상품이 없습니다.</h3>
          <p>장바구니에 상품을 담은 뒤 결제를 진행할 수 있습니다.</p>
        </div>
      ) : (
        <div className="store-page-layout">
          <section className="checkout-card" aria-label="Order products">
            <h3>주문 상품</h3>
            {lines.map((line) => (
              <div className="checkout-line" key={line.productId}>
                <span>{line.product.name}</span>
                <strong>
                  {line.quantity}개 / {formatPrice(line.lineTotal)}
                </strong>
              </div>
            ))}
            <div className="mock-checkout-box">
              <strong>MVP mock checkout</strong>
              <p>실제 결제 API 없이 주문 상품과 결제 예정 금액만 확인합니다.</p>
            </div>
          </section>
          <OrderSummary
            actionLabel="결제 완료"
            disabled={false}
            onAction={completeCheckout}
          />
        </div>
      )}
    </section>
  );
}
