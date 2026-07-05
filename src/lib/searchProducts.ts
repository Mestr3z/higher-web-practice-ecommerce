import type { Product } from '../types';

export function searchProducts(products: Product[], query: string): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return products;
  return products.filter((product) => product.name.toLowerCase().includes(normalized));
}
