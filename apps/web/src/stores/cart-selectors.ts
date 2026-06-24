"use client";

import { useMemo } from "react";
import { products } from "@/data/products";
import { getCartLines, getCartSummary } from "@/stores/cart-logic";
import { useCartStore } from "@/stores/cart-store";

export function useStoreView() {
  return useCartStore((state) => state.view);
}

export function useSelectedProduct() {
  const selectedProductId = useCartStore((state) => state.selectedProductId);

  return useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? null,
    [selectedProductId],
  );
}

export function useCartLines() {
  const items = useCartStore((state) => state.items);

  return useMemo(() => getCartLines(items), [items]);
}

export function useCartSummary() {
  const items = useCartStore((state) => state.items);

  return useMemo(() => getCartSummary(items), [items]);
}
