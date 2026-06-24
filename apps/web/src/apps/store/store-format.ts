import { type Product } from "@/data/products";

const currencyFormatter = new Intl.NumberFormat("ko-KR", {
  currency: "KRW",
  style: "currency",
});

export function formatPrice(price: number) {
  return currencyFormatter.format(price);
}

export function getDiscountRate(product: Product) {
  return Math.round(
    ((product.originalPrice - product.salePrice) / product.originalPrice) * 100,
  );
}
