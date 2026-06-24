"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  addCartItem,
  getCartLines,
  getCartSummary,
  isValidProductId,
  removeCartItem,
  updateCartItemQuantity,
  type CartItem,
} from "@/stores/cart-logic";

export const cartStorageKey = "portfolio-os-cart";

export type StoreView = "products" | "cart" | "checkout";

type CartState = {
  items: CartItem[];
  selectedProductId: string | null;
  selectedQuantity: number;
  view: StoreView;
  addItem: (productId: string, quantity: number) => void;
  addSelectedProduct: () => void;
  closeOptionSheet: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  openCheckout: () => void;
  openProducts: () => void;
  openOptionSheet: (productId: string) => void;
  setSelectedQuantity: (quantity: number) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      selectedProductId: null,
      selectedQuantity: 1,
      view: "products",
      addItem: (productId, quantity) => {
        set((state) => {
          const items = addCartItem(state.items, productId, quantity);
          return items === state.items ? state : { items };
        });
      },
      addSelectedProduct: () => {
        set((state) => {
          if (!state.selectedProductId) {
            return state;
          }

          return {
            items: addCartItem(
              state.items,
              state.selectedProductId,
              state.selectedQuantity,
            ),
            selectedProductId: null,
            selectedQuantity: 1,
          };
        });
      },
      closeOptionSheet: () => {
        set({ selectedProductId: null, selectedQuantity: 1 });
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: updateCartItemQuantity(state.items, productId, quantity),
        }));
      },
      removeItem: (productId) => {
        set((state) => ({
          items: removeCartItem(state.items, productId),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      openCart: () => {
        set({ view: "cart" });
      },
      openCheckout: () => {
        set({ view: "checkout" });
      },
      openProducts: () => {
        set({ view: "products" });
      },
      openOptionSheet: (productId) => {
        if (!isValidProductId(productId)) {
          return;
        }

        set({ selectedProductId: productId, selectedQuantity: 1 });
      },
      setSelectedQuantity: (quantity) => {
        set({ selectedQuantity: Math.max(1, quantity) });
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
