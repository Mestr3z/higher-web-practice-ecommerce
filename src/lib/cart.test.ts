import { makeProduct } from '../test/factories';
import { buildCart } from './cart';

const a = makeProduct({ id: 'a', price: 590 });
const b = makeProduct({ id: 'b', price: 1490 });
const products = [a, b];

describe('buildCart', () => {
  it('считает сумму строк и общее количество', () => {
    const cart = buildCart(
      [
        { productId: 'a', quantity: 2 },
        { productId: 'b', quantity: 1 },
      ],
      products,
    );
    expect(cart.totalItems).toBe(3);
    expect(cart.totalPrice).toBe(590 * 2 + 1490);
    expect(cart.items).toHaveLength(2);
    expect(cart.items[0].price).toBe(590);
  });

  it('пропускает товары, которых нет в каталоге', () => {
    const cart = buildCart(
      [
        { productId: 'a', quantity: 1 },
        { productId: 'zzz', quantity: 5 },
      ],
      products,
    );
    expect(cart.items).toHaveLength(1);
    expect(cart.totalPrice).toBe(590);
  });

  it('пустая корзина', () => {
    const cart = buildCart([], products);
    expect(cart).toEqual({ items: [], totalPrice: 0, totalItems: 0 });
  });
});
