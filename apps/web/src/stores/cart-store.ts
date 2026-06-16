"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { products } from "@/data/products";
import { getCartLines, getCartSummary, type CartItem } from "@/apps/store-cart";

export const cartStorageKey = "portfolio-os-cart";

type CartState = {
  items: CartItem[];
  addItem: (productId: string, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const productIds = new Set(products.map((product) => product.id));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (productId, quantity) => {
        if (!productIds.has(productId) || quantity <= 0) {
          return;
        }

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === productId,
          );

          if (!existingItem) {
            return {
              items: [...state.items, { productId, quantity }],
            };
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          };
        });
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.productId !== productId)
              : state.items.map((item) =>
                  item.productId === productId ? { ...item, quantity } : item,
                ),
        }));
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: cartStorageKey,
      partialize: (state) => ({ items: state.items }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function getStoredCartLines(items: CartItem[]) {
  return getCartLines(items);
}

export function getStoredCartSummary(items: CartItem[]) {
  return getCartSummary(items);
}
