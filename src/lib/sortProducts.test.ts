import { makeProduct } from '../test/factories';
import { sortProducts } from './sortProducts';

const cheap = makeProduct({
  id: 'a',
  price: 590,
  rating: 3,
  createdAt: '2026-01-01',
});
const mid = makeProduct({
  id: 'b',
  price: 1790,
  rating: 5,
  createdAt: '2026-02-01',
});
const pricey = makeProduct({
  id: 'c',
  price: 5590,
  rating: 4,
  createdAt: '2026-03-01',
});
const list = [mid, pricey, cheap];

describe('sortProducts', () => {
  it('по возрастанию цены', () => {
    expect(sortProducts(list, 'price_asc').map((p) => p.id)).toEqual(['a', 'b', 'c']);
  });

  it('по убыванию цены', () => {
    expect(sortProducts(list, 'price_desc').map((p) => p.id)).toEqual(['c', 'b', 'a']);
  });

  it('по рейтингу (убыв.)', () => {
    expect(sortProducts(list, 'rating').map((p) => p.id)).toEqual(['b', 'c', 'a']);
  });

  it('по новизне (сначала новые)', () => {
    expect(sortProducts(list, 'newest').map((p) => p.id)).toEqual(['c', 'b', 'a']);
  });

  it('не мутирует исходный массив', () => {
    const original = [...list];
    sortProducts(list, 'price_asc');
    expect(list).toEqual(original);
  });
});
