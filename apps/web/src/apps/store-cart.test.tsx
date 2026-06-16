import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { products } from "@/data/products";
import {
  cartStorageKey,
  getStoredCartSummary,
  useCartStore,
} from "@/stores/cart-store";
import { StoreApp } from "./store-app";
import {
  addCartItem,
  getCartSummary,
  parseStoredCart,
  removeCartItem,
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
      total: firstProduct.salePrice * 2 + secondProduct.salePrice,
    });
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

  it("updates quantities and removes items when quantity reaches zero", () => {
    const [firstProduct] = products;
    const initialItems = [{ productId: firstProduct.id, quantity: 2 }];

    expect(
      updateCartItemQuantity(initialItems, firstProduct.id, 4),
    ).toEqual([{ productId: firstProduct.id, quantity: 4 }]);
    expect(
      updateCartItemQuantity(initialItems, firstProduct.id, 0),
    ).toEqual([]);
  });

  it("removes products from the cart", () => {
    const [firstProduct, secondProduct] = products;

    expect(
      removeCartItem(
        [
          { productId: firstProduct.id, quantity: 1 },
          { productId: secondProduct.id, quantity: 1 },
        ],
        firstProduct.id,
      ),
    ).toEqual([{ productId: secondProduct.id, quantity: 1 }]);
  });
});

describe("cart zustand store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useCartStore.setState({ items: [] });
  });

  it("persists cart items and exposes summary helpers", async () => {
    const [firstProduct] = products;

    useCartStore.getState().addItem(firstProduct.id, 2);

    expect(getStoredCartSummary(useCartStore.getState().items)).toEqual({
      itemCount: 2,
      total: firstProduct.salePrice * 2,
    });
    await waitFor(() => {
      expect(window.localStorage.getItem(cartStorageKey)).toContain(
        firstProduct.id,
      );
    });
  });

  it("updates, removes, and clears cart items through store actions", () => {
    const [firstProduct, secondProduct] = products;
    const cartStore = useCartStore.getState();

    cartStore.addItem(firstProduct.id, 1);
    cartStore.addItem(secondProduct.id, 2);
    cartStore.updateQuantity(firstProduct.id, 3);

    expect(useCartStore.getState().items).toEqual([
      { productId: firstProduct.id, quantity: 3 },
      { productId: secondProduct.id, quantity: 2 },
    ]);

    useCartStore.getState().removeItem(secondProduct.id);

    expect(useCartStore.getState().items).toEqual([
      { productId: firstProduct.id, quantity: 3 },
    ]);

    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toEqual([]);
  });
});

describe("StoreApp", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useCartStore.setState({ items: [] });
  });

  it("opens product option selector and adds selected quantity to cart", async () => {
    const user = userEvent.setup();

    render(<StoreApp />);

    await user.click(
      screen.getByRole("button", {
        name: `Open ${products[0].name} option selector`,
      }),
    );

    expect(
      screen.getByRole("dialog", { name: "Option selector" }),
    ).toBeInTheDocument();
    expect(screen.getByText("옵션선택")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: `Increase ${products[0].name} quantity`,
      }),
    );

    expect(screen.getByLabelText("Selected product total")).toHaveTextContent(
      "₩41,980",
    );

    await user.click(screen.getByRole("button", { name: "장바구니 담기" }));

    expect(
      screen.queryByRole("dialog", { name: "Option selector" }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Cart item count")).toHaveTextContent("2");
  });

  it("moves from the cart page to checkout and completes mock payment", async () => {
    const user = userEvent.setup();

    useCartStore.setState({
      items: [{ productId: products[1].id, quantity: 1 }],
    });

    render(<StoreApp />);

    await user.click(screen.getByRole("button", { name: "Open cart page" }));

    expect(
      screen.getByRole("region", { name: "Cart page" }),
    ).toBeInTheDocument();
    expect(screen.getByText(products[1].name)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "결제하기" }));

    expect(
      screen.getByRole("region", { name: "Checkout page" }),
    ).toBeInTheDocument();
    expect(screen.getByText("MVP mock checkout")).toBeInTheDocument();
    expect(screen.getByLabelText("Order total")).toHaveTextContent("₩15,990");

    await user.click(screen.getByRole("button", { name: "결제 완료" }));

    expect(screen.getByRole("heading", { name: "Mini storefront" }));
    expect(screen.getByLabelText("Cart item count")).toHaveTextContent("0");
  });

  it("changes quantity and removes products on the cart page", async () => {
    const user = userEvent.setup();

    useCartStore.setState({
      items: [{ productId: products[0].id, quantity: 2 }],
    });

    render(<StoreApp />);

    await user.click(screen.getByRole("button", { name: "Open cart page" }));
    await user.click(
      screen.getByRole("button", {
        name: `Decrease ${products[0].name} quantity`,
      }),
    );

    expect(screen.getByLabelText(`${products[0].name} quantity`)).toHaveTextContent(
      "1",
    );
    expect(screen.getByLabelText("Order total")).toHaveTextContent("₩20,990");

    await user.click(
      screen.getByRole("button", { name: `Remove ${products[0].name}` }),
    );

    expect(screen.getByText("장바구니가 비어있습니다.")).toBeInTheDocument();
    expect(useCartStore.getState().items).toEqual([]);
  });
});
