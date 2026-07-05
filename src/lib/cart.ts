import type { Cart, CartItem, Product } from '../types';

type CartEntry = {
  productId: string;
  quantity: number;
};

export function buildCart(entries: CartEntry[], products: Product[]): Cart {
  const items: CartItem[] = [];

  for (const entry of entries) {
    const product = products.find((candidate) => candidate.id === entry.productId);
    if (!product) continue;

    items.push({
      productId: entry.productId,
      product,
      quantity: entry.quantity,
      price: product.price,
    });
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, totalPrice, totalItems };
}
