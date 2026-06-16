import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { cartStorageKey, StoreApp } from "./store-app";
import {
  addCartItem,
  getCartSummary,
  parseStoredCart,
  updateCartItemQuantity,
} from "./store-cart";

describe("store cart logic", () => {
  it("adds products and calculates total quantity and price", () => {
    const [firstProduct, secondProduct] = products;
    const cartItems = addCartItem(
      addCartItem(addCartItem([], firstProduct.id), firstProduct.id),
      secondProduct.id,
    );

    expect(cartItems).toEqual([
      { productId: firstProduct.id, quantity: 2 },
      { productId: secondProduct.id, quantity: 1 },
    ]);
    expect(getCartSummary(cartItems)).toEqual({
      itemCount: 3,
      total: firstProduct.price * 2 + secondProduct.price,
    });
  });

  it("removes items when quantity is set below one", () => {
    const [firstProduct] = products;

    expect(
      updateCartItemQuantity(
        [{ productId: firstProduct.id, quantity: 1 }],
        firstProduct.id,
        0,
      ),
    ).toEqual([]);
  });

  it("parses only valid stored cart items", () => {
    const [firstProduct] = products;

    expect(
      parseStoredCart(
        JSON.stringify([
          { productId: firstProduct.id, quantity: 2 },
          { productId: "missing", quantity: 2 },
          { productId: firstProduct.id, quantity: -1 },
          { productId: firstProduct.id, quantity: 1.5 },
        ]),
      ),
    ).toEqual([{ productId: firstProduct.id, quantity: 2 }]);
  });
});

describe("StoreApp", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders products and updates cart totals", async () => {
    const user = userEvent.setup();

    render(<StoreApp />);

    expect(
      screen.getByRole("heading", { name: "Mini storefront" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Grid Desk Mat")).toBeInTheDocument();
    expect(screen.getByLabelText("Cart item count")).toHaveTextContent(
      "0 items",
    );

    await user.click(
      screen.getByRole("button", { name: "Add Grid Desk Mat to cart" }),
    );
    await user.click(
      screen.getByRole("button", {
        name: "Increase Grid Desk Mat quantity",
      }),
    );

    expect(screen.getByLabelText("Cart item count")).toHaveTextContent(
      "2 items",
    );
    expect(screen.getByLabelText("Grid Desk Mat quantity")).toHaveTextContent(
      "2",
    );
    expect(screen.getByLabelText("Cart total")).toHaveTextContent("₩64,000");
    await waitFor(() => {
      expect(window.localStorage.getItem(cartStorageKey)).toBe(
        JSON.stringify([{ productId: "desk-mat", quantity: 2 }]),
      );
    });
  });

  it("restores and persists cart items with localStorage", async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(
      cartStorageKey,
      JSON.stringify([{ productId: "field-notebook", quantity: 2 }]),
    );

    render(<StoreApp />);

    await waitFor(() => {
      expect(screen.getByLabelText("Cart item count")).toHaveTextContent(
        "2 items",
      );
    });

    await user.click(
      screen.getByRole("button", { name: "Remove Field Notebook" }),
    );

    expect(screen.getByText("Cart is empty.")).toBeInTheDocument();
    expect(window.localStorage.getItem(cartStorageKey)).toBe("[]");
  });
});
