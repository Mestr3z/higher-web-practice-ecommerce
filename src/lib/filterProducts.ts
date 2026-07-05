import type { Product } from '../types';

export type CatalogFilters = {
  category: string | null;
  styles: string[];
  density: string | null;
  curl: string | null;
  priceMin: number | null;
  priceMax: number | null;
  needsWax: boolean;
  boostsCharisma: boolean;
};

export const emptyFilters: CatalogFilters = {
  category: null,
  styles: [],
  density: null,
  curl: null,
  priceMin: null,
  priceMax: null,
  needsWax: false,
  boostsCharisma: false,
};

const CHARISMA_THRESHOLD = 4;

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  return products.filter((product) => {
    const c = product.characteristics;

    if (filters.category && c['категория'] !== filters.category) return false;
    if (filters.styles.length > 0 && !filters.styles.includes(c['стиль'])) return false;
    if (filters.density && c['густота'] !== filters.density) return false;
    if (filters.curl && c['закрученность'] !== filters.curl) return false;
    if (filters.priceMin !== null && product.price < filters.priceMin) return false;
    if (filters.priceMax !== null && product.price > filters.priceMax) return false;
    if (filters.needsWax && c['закрученность'] === 'Низкая') return false;
    if (filters.boostsCharisma && Number(c['харизма']) < CHARISMA_THRESHOLD) return false;

    return true;
  });
}

export function getFacetValues(products: Product[], key: string): string[] {
  const values = new Set<string>();
  for (const product of products) {
    const value = product.characteristics[key];
    if (value) values.add(value);
  }
  return [...values];
}
