import { products, type Product } from "@/data/products";

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CartLine = CartItem & {
  product: Product;
  lineTotal: number;
};

const productIds = new Set(products.map((product) => product.id));

export function addCartItem(items: CartItem[], productId: string): CartItem[] {
  if (!productIds.has(productId)) {
    return items;
  }

  const existingItem = items.find((item) => item.productId === productId);

  if (!existingItem) {
    return [...items, { productId, quantity: 1 }];
  }

  return items.map((item) =>
    item.productId === productId
      ? { ...item, quantity: item.quantity + 1 }
      : item,
  );
}

export function updateCartItemQuantity(
  items: CartItem[],
  productId: string,
  quantity: number,
): CartItem[] {
  if (quantity <= 0) {
    return removeCartItem(items, productId);
  }

  return items.map((item) =>
    item.productId === productId ? { ...item, quantity } : item,
  );
}

export function removeCartItem(items: CartItem[], productId: string): CartItem[] {
  return items.filter((item) => item.productId !== productId);
}

export function getCartLines(items: CartItem[]): CartLine[] {
  return items.flatMap((item) => {
    const product = products.find(
      (currentProduct) => currentProduct.id === item.productId,
    );

    if (!product || item.quantity <= 0) {
      return [];
    }

    return [
      {
        ...item,
        product,
        lineTotal: product.price * item.quantity,
      },
    ];
  });
}

export function getCartSummary(items: CartItem[]) {
  const lines = getCartLines(items);

  return {
    itemCount: lines.reduce((total, line) => total + line.quantity, 0),
    total: lines.reduce((total, line) => total + line.lineTotal, 0),
  };
}

export function parseStoredCart(value: string | null): CartItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.flatMap((item) => {
      if (
        typeof item !== "object" ||
        item === null ||
        !("productId" in item) ||
        !("quantity" in item) ||
        typeof item.productId !== "string" ||
        typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0 ||
        !productIds.has(item.productId)
      ) {
        return [];
      }

      return [{ productId: item.productId, quantity: item.quantity }];
    });
  } catch {
    return [];
  }
}
