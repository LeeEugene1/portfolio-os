import { type Product } from "@/data/products";

export function ProductThumb({ product }: { product: Product }) {
  return (
    <div aria-label={`${product.name} image`} className="product-thumb">
      <span>{product.badges[0]}</span>
      <strong>{product.name.slice(0, 2)}</strong>
    </div>
  );
}
