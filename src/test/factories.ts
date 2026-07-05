import type { Product } from '../types';

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1',
    name: 'Товар',
    description: 'Описание',
    price: 1000,
    images: ['/mustashes/x/0.png'],
    characteristics: {
      категория: 'Классические',
      стиль: 'Военный',
      густота: 'Средняя',
      закрученность: 'Низкая',
      харизма: '3',
    },
    inStock: true,
    rating: 4,
    ratingCount: 2,
    createdAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}
