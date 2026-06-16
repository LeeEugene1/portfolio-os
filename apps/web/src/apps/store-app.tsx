"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/data/products";
import {
  addCartItem,
  getCartLines,
  getCartSummary,
  parseStoredCart,
  removeCartItem,
  updateCartItemQuantity,
  type CartItem,
} from "./store-cart";

export const cartStorageKey = "portfolio-os-cart";
const currencyFormatter = new Intl.NumberFormat("ko-KR", {
  currency: "KRW",
  style: "currency",
});

function formatPrice(price: number) {
  return currencyFormatter.format(price);
}

export function StoreApp() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const cartLines = useMemo(() => getCartLines(cartItems), [cartItems]);
  const summary = useMemo(() => getCartSummary(cartItems), [cartItems]);

  useEffect(() => {
    setCartItems(parseStoredCart(window.localStorage.getItem(cartStorageKey)));
    setHasLoadedCart(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) {
      return;
    }

    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  }, [cartItems, hasLoadedCart]);

  return (
    <div className="app-content store-app">
      <div className="store-header">
        <div>
          <p className="eyebrow">Store</p>
          <h2>Mini storefront</h2>
        </div>
        <output aria-label="Cart item count">{summary.itemCount} items</output>
      </div>

      <div className="store-layout">
        <section className="product-list" aria-label="Products">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div>
                <span>{product.badge}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
              <div className="product-card-footer">
                <strong>{formatPrice(product.price)}</strong>
                <button
                  aria-label={`Add ${product.name} to cart`}
                  type="button"
                  onClick={() =>
                    setCartItems((currentItems) =>
                      addCartItem(currentItems, product.id),
                    )
                  }
                >
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="cart-panel" aria-label="Cart">
          <div className="cart-panel-header">
            <h3>Cart</h3>
            <strong aria-label="Cart total">{formatPrice(summary.total)}</strong>
          </div>

          {cartLines.length === 0 ? (
            <p className="empty-cart">Cart is empty.</p>
          ) : (
            <ul className="cart-lines">
              {cartLines.map((line) => (
                <li key={line.productId}>
                  <div className="cart-line-info">
                    <strong>{line.product.name}</strong>
                    <span>{formatPrice(line.lineTotal)}</span>
                  </div>
                  <div className="cart-line-controls">
                    <button
                      aria-label={`Decrease ${line.product.name} quantity`}
                      type="button"
                      onClick={() =>
                        setCartItems((currentItems) =>
                          updateCartItemQuantity(
                            currentItems,
                            line.productId,
                            line.quantity - 1,
                          ),
                        )
                      }
                    >
                      <Minus size={15} />
                    </button>
                    <output aria-label={`${line.product.name} quantity`}>
                      {line.quantity}
                    </output>
                    <button
                      aria-label={`Increase ${line.product.name} quantity`}
                      type="button"
                      onClick={() =>
                        setCartItems((currentItems) =>
                          updateCartItemQuantity(
                            currentItems,
                            line.productId,
                            line.quantity + 1,
                          ),
                        )
                      }
                    >
                      <Plus size={15} />
                    </button>
                    <button
                      aria-label={`Remove ${line.product.name}`}
                      type="button"
                      onClick={() =>
                        setCartItems((currentItems) =>
                          removeCartItem(currentItems, line.productId),
                        )
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
