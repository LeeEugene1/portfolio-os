import { useCartSummary } from "@/stores/cart-selectors";
import { formatPrice } from "@/apps/store/store-format";

export function OrderSummary({
  actionLabel,
  disabled,
  onAction,
}: {
  actionLabel: string;
  disabled: boolean;
  onAction: () => void;
}) {
  const summary = useCartSummary();

  return (
    <aside className="order-summary" aria-label="Order summary">
      <h3>주문 요약</h3>
      <dl>
        <div>
          <dt>총 수량</dt>
          <dd>{summary.itemCount}개</dd>
        </div>
        <div>
          <dt>상품 금액</dt>
          <dd>{formatPrice(summary.total)}</dd>
        </div>
        <div>
          <dt>배송비</dt>
          <dd>무료배송</dd>
        </div>
        <div>
          <dt>결제 예정 금액</dt>
          <dd aria-label="Order total">{formatPrice(summary.total)}</dd>
        </div>
      </dl>
      <button
        className="store-primary-action"
        disabled={disabled}
        type="button"
        onClick={onAction}
      >
        {actionLabel}
      </button>
    </aside>
  );
}
