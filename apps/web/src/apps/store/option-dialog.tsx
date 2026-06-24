import { X } from "lucide-react";
import { useSelectedProduct } from "@/stores/cart-selectors";
import { useCartStore } from "@/stores/cart-store";
import { ProductThumb } from "@/apps/store/product-thumb";
import { QuantityStepper } from "@/apps/store/quantity-stepper";
import { formatPrice } from "@/apps/store/store-format";

export function OptionDialog() {
  const product = useSelectedProduct();
  const addSelectedProduct = useCartStore((state) => state.addSelectedProduct);
  const closeOptionSheet = useCartStore((state) => state.closeOptionSheet);
  const quantity = useCartStore((state) => state.selectedQuantity);
  const setSelectedQuantity = useCartStore((state) => state.setSelectedQuantity);

  if (!product) {
    return null;
  }

  const total = product.salePrice * quantity;

  return (
    <div className="option-overlay" role="presentation">
      <section
        aria-label="Option selector"
        aria-modal="true"
        className="option-dialog"
        role="dialog"
      >
        <div className="option-handle" />
        <header>
          <h3>옵션선택</h3>
          <button
            aria-label="Close option selector"
            type="button"
            onClick={closeOptionSheet}
          >
            <X size={24} />
          </button>
        </header>
        <div className="option-product">
          <ProductThumb product={product} />
          <strong>{product.name}</strong>
        </div>
        <div className="option-single">
          <span>{product.optionLabel}</span>
        </div>
        <div className="option-quantity-card">
          <strong>구매수량</strong>
          <QuantityStepper
            label={product.name}
            onChange={setSelectedQuantity}
            quantity={quantity}
          />
          <b>{formatPrice(total)}</b>
        </div>
        <div className="option-total">
          <span>총 상품 금액</span>
          <small>총 수량 {quantity}개</small>
          <strong aria-label="Selected product total">{formatPrice(total)}</strong>
        </div>
        <div className="delivery-info">
          <span>배송정보</span>
          <strong>{product.deliveryText}</strong>
          <small>{product.shippingNote}</small>
        </div>
        <button
          className="store-primary-action"
          type="button"
          onClick={addSelectedProduct}
        >
          장바구니 담기
        </button>
      </section>
    </div>
  );
}
