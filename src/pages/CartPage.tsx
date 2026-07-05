import { Link, useNavigate } from 'react-router-dom';

import { useGetProductsQuery } from '../api/productsApi';
import shoppingImage from '../assets/shopping.png';
import TrashIcon from '../assets/Trash.svg?react';
import { Button, QuantityStepper } from '../components/ui';
import { removeFromCart, selectCartItems, setQuantity } from '../features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { buildCart } from '../lib/cart';
import { formatPrice } from '../lib/formatPrice';

export function CartPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const entries = useAppSelector(selectCartItems);
  const { data: products, isLoading } = useGetProductsQuery();

  if (isLoading) return <p className="text-text-secondary">Загрузка…</p>;

  const cart = buildCart(entries, products ?? []);

  if (cart.items.length === 0) {
    return (
      <div>
        <h1 className="text-h1">Корзина</h1>
        <div className="bg-surface text-text-secondary mt-6 rounded-xl p-6">
          Корзина пуста.{' '}
          <Link to="/" className="text-accent hover:text-accent-hover font-semibold">
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-h1">Корзина</h1>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <ul className="flex flex-1 flex-col gap-4">
          {cart.items.map((item) => (
            <li
              key={item.productId}
              className="bg-surface flex items-center gap-4 rounded-xl p-4"
            >
              <Link to={`/products/${item.productId}`} className="shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-16 w-16 rounded-lg object-contain"
                />
              </Link>

              <Link
                to={`/products/${item.productId}`}
                className="text-accent hover:text-accent-hover min-w-0 flex-1 text-sm font-medium"
              >
                {item.product.name}
              </Link>

              <QuantityStepper
                value={item.quantity}
                onChange={(quantity) =>
                  dispatch(setQuantity({ productId: item.productId, quantity }))
                }
              />

              <span className="text-success w-24 shrink-0 text-right text-base font-bold">
                {formatPrice(item.price * item.quantity)}
              </span>

              <button
                type="button"
                onClick={() => dispatch(removeFromCart(item.productId))}
                aria-label={`Удалить «${item.product.name}» из корзины`}
                className="text-accent hover:text-accent-hover shrink-0"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-6 lg:w-80 lg:shrink-0">
          <aside className="bg-surface rounded-xl p-6">
            <h2 className="text-h3">Ваша корзина</h2>

            <div className="text-text-secondary mt-4 flex justify-between text-sm">
              <span>Товаров</span>
              <span>{cart.totalItems}</span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-text-secondary text-sm">Сумма заказа</span>
              <span className="text-h3 text-success font-bold">
                {formatPrice(cart.totalPrice)}
              </span>
            </div>

            <Button fullWidth className="mt-6" onClick={() => navigate('/checkout')}>
              Оформить заказ
            </Button>
          </aside>

          <img
            src={shoppingImage}
            alt=""
            aria-hidden="true"
            className="hidden lg:block"
          />
        </div>
      </div>
    </div>
  );
}
