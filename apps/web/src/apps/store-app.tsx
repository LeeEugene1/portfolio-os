"use client";

import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { products, type Product } from "@/data/products";
import {
  getStoredCartLines,
  getStoredCartSummary,
  useCartStore,
} from "@/stores/cart-store";

type StoreView = "products" | "cart" | "checkout";

const currencyFormatter = new Intl.NumberFormat("ko-KR", {
  currency: "KRW",
  style: "currency",
});

function formatPrice(price: number) {
  return currencyFormatter.format(price);
}

function getDiscountRate(product: Product) {
  return Math.round(
    ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
  );
}

export function StoreApp() {
  const [view, setView] = useState<StoreView>("products");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartLines = useMemo(() => getStoredCartLines(items), [items]);
  const summary = useMemo(() => getStoredCartSummary(items), [items]);

  function openOptionSheet(product: Product) {
    setSelectedProduct(product);
    setSelectedQuantity(1);
  }

  function closeOptionSheet() {
    setSelectedProduct(null);
  }

  function addSelectedProductToCart() {
    if (!selectedProduct) {
      return;
    }

    addItem(selectedProduct.id, selectedQuantity);
    closeOptionSheet();
  }

  return (
    <div className="app-content store-app">
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
          onClick={() => setView("cart")}
        >
          <ShoppingBag size={18} />
          <output aria-label="Cart item count">{summary.itemCount}</output>
        </button>
      </header>

      {view === "products" && (
        <ProductList products={products} onSelectProduct={openOptionSheet} />
      )}

      {view === "cart" && (
        <CartPage
          lines={cartLines}
          onCheckout={() => setView("checkout")}
          onContinueShopping={() => setView("products")}
          onRemoveItem={removeItem}
          onUpdateQuantity={updateQuantity}
          summary={summary}
        />
      )}

      {view === "checkout" && (
        <CheckoutPage
          lines={cartLines}
          onBackToCart={() => setView("cart")}
          onComplete={() => {
            clearCart();
            setView("products");
          }}
          summary={summary}
        />
      )}

      {selectedProduct && (
        <OptionDialog
          onAddToCart={addSelectedProductToCart}
          onClose={closeOptionSheet}
          onQuantityChange={setSelectedQuantity}
          product={selectedProduct}
          quantity={selectedQuantity}
        />
      )}
    </div>
  );
}

function ProductList({
  onSelectProduct,
  products,
}: {
  onSelectProduct: (product: Product) => void;
  products: Product[];
}) {
  return (
    <section className="product-list" aria-label="Products">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <ProductThumb product={product} />
          <div className="product-card-body">
            <div className="product-badges">
              {product.badges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="product-price-row">
              <strong>{getDiscountRate(product)}%</strong>
              <b>{formatPrice(product.salePrice)}</b>
            </div>
            <small>{product.deliveryText}</small>
            <div className="product-rating" aria-label={`${product.rating} rating`}>
              ★★★★★ <span>({product.reviewCount})</span>
            </div>
          </div>
          <button
            aria-label={`Open ${product.name} option selector`}
            className="product-cart-button"
            type="button"
            onClick={() => onSelectProduct(product)}
          >
            <ShoppingBag size={18} />
          </button>
        </article>
      ))}
    </section>
  );
}

function ProductThumb({ product }: { product: Product }) {
  return (
    <div
      aria-label={`${product.name} image`}
      className="product-thumb"
      style={{ "--product-tone": product.imageTone } as CSSProperties}
    >
      <span>{product.badges[0]}</span>
      <strong>{product.name.slice(0, 2)}</strong>
    </div>
  );
}

function QuantityStepper({
  label,
  onChange,
  quantity,
}: {
  label: string;
  onChange: (quantity: number) => void;
  quantity: number;
}) {
  return (
    <div className="quantity-stepper">
      <button
        aria-label={`Decrease ${label} quantity`}
        type="button"
        onClick={() => onChange(quantity - 1)}
      >
        <Minus size={15} />
      </button>
      <output aria-label={`${label} quantity`}>{quantity}</output>
      <button
        aria-label={`Increase ${label} quantity`}
        type="button"
        onClick={() => onChange(quantity + 1)}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

function OptionDialog({
  onAddToCart,
  onClose,
  onQuantityChange,
  product,
  quantity,
}: {
  onAddToCart: () => void;
  onClose: () => void;
  onQuantityChange: (quantity: number) => void;
  product: Product;
  quantity: number;
}) {
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
          <button aria-label="Close option selector" type="button" onClick={onClose}>
            <X size={24} />
          </button>
        </header>
        <div className="option-product">
          <ProductThumb product={product} />
          <strong>{product.name}</strong>
        </div>
        <button className="option-select" type="button">
          <span>{product.optionLabel}</span>
          <span>⌃</span>
        </button>
        <div className="option-quantity-card">
          <strong>구매수량</strong>
          <QuantityStepper
            label={product.name}
            onChange={(nextQuantity) =>
              onQuantityChange(Math.max(1, nextQuantity))
            }
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
        <button className="store-primary-action" type="button" onClick={onAddToCart}>
          장바구니 담기
        </button>
      </section>
    </div>
  );
}

function CartPage({
  lines,
  onCheckout,
  onContinueShopping,
  onRemoveItem,
  onUpdateQuantity,
  summary,
}: {
  lines: ReturnType<typeof getStoredCartLines>;
  onCheckout: () => void;
  onContinueShopping: () => void;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  summary: ReturnType<typeof getStoredCartSummary>;
}) {
  return (
    <section className="store-page" aria-label="Cart page">
      <button className="store-back-button" type="button" onClick={onContinueShopping}>
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
                    onUpdateQuantity(line.productId, quantity)
                  }
                  quantity={line.quantity}
                />
                <button
                  aria-label={`Remove ${line.product.name}`}
                  className="cart-remove-button"
                  type="button"
                  onClick={() => onRemoveItem(line.productId)}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
          <OrderSummary
            actionLabel="결제하기"
            disabled={lines.length === 0}
            onAction={onCheckout}
            summary={summary}
          />
        </div>
      )}
    </section>
  );
}

function CheckoutPage({
  lines,
  onBackToCart,
  onComplete,
  summary,
}: {
  lines: ReturnType<typeof getStoredCartLines>;
  onBackToCart: () => void;
  onComplete: () => void;
  summary: ReturnType<typeof getStoredCartSummary>;
}) {
  return (
    <section className="store-page" aria-label="Checkout page">
      <button className="store-back-button" type="button" onClick={onBackToCart}>
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
            onAction={onComplete}
            summary={summary}
          />
        </div>
      )}
    </section>
  );
}

function OrderSummary({
  actionLabel,
  disabled,
  onAction,
  summary,
}: {
  actionLabel: string;
  disabled: boolean;
  onAction: () => void;
  summary: ReturnType<typeof getStoredCartSummary>;
}) {
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
