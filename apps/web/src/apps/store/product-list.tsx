import { ShoppingBag } from "lucide-react";
import { products } from "@/data/products";
import { useCartStore } from "@/stores/cart-store";
import { ProductThumb } from "@/apps/store/product-thumb";
import { formatPrice, getDiscountRate } from "@/apps/store/store-format";

export function ProductList() {
  const openOptionSheet = useCartStore((state) => state.openOptionSheet);

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
            onClick={() => openOptionSheet(product.id)}
          >
            <ShoppingBag size={18} />
          </button>
        </article>
      ))}
    </section>
  );
}
