import { ArrowLeft, Trash2 } from "lucide-react";
import { useCartLines } from "@/stores/cart-selectors";
import { useCartStore } from "@/stores/cart-store";
import { OrderSummary } from "@/apps/store/order-summary";
import { ProductThumb } from "@/apps/store/product-thumb";
import { QuantityStepper } from "@/apps/store/quantity-stepper";
import { formatPrice } from "@/apps/store/store-format";

export function CartPage() {
  const lines = useCartLines();
  const openCheckout = useCartStore((state) => state.openCheckout);
  const openProducts = useCartStore((state) => state.openProducts);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return (
    <section className="store-page" aria-label="Cart page">
      <button className="store-back-button" type="button" onClick={openProducts}>
        <ArrowLeft size={16} />
        쇼핑 계속하기
      </button>
      {lines.length === 0 ? (
        <div className="empty-cart">
          <h3>장바구니가 비어있습니다.</h3>
          <p>상품 카드의 장바구니 아이콘을 눌러 옵션을 선택해보세요.</p>
        </div>
      ) : (
        <div className="store-page-layout">
          <ul className="cart-lines">
            {lines.map((line) => (
              <li key={line.productId}>
                <ProductThumb product={line.product} />
                <div className="cart-line-info">
                  <strong>{line.product.name}</strong>
                  <span>{line.product.optionLabel}</span>
                  <b>{formatPrice(line.lineTotal)}</b>
                </div>
                <QuantityStepper
                  label={line.product.name}
                  onChange={(quantity) =>
                    updateQuantity(line.productId, quantity)
                  }
                  quantity={line.quantity}
                />
                <button
                  aria-label={`Remove ${line.product.name}`}
                  className="cart-remove-button"
                  type="button"
                  onClick={() => removeItem(line.productId)}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
          <OrderSummary
            actionLabel="결제하기"
            disabled={lines.length === 0}
            onAction={openCheckout}
          />
        </div>
      )}
    </section>
  );
}
