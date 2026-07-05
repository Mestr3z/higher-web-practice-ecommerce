import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useGetOrdersQuery } from '../api/ordersApi';
import { useGetProductQuery } from '../api/productsApi';
import { useAddRatingMutation, useGetRatingsByProductQuery } from '../api/ratingsApi';
import BagIcon from '../assets/Shopping_bag.svg?react';
import { RatingStars } from '../components/shared';
import { Button, RatingInput } from '../components/ui';
import { selectUser } from '../features/auth/authSlice';
import { addToCart } from '../features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { formatPrice } from '../lib/formatPrice';

function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductQuery(id ?? '', { skip: !id });
  const { data: reviews } = useGetRatingsByProductQuery(id ?? '', {
    skip: !id,
  });
  const { data: orders } = useGetOrdersQuery(user?.id ?? '', { skip: !user });
  const [addRating, { isLoading: isRating }] = useAddRatingMutation();

  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) return <p className="text-text-secondary">Загрузка…</p>;
  if (isError || !product) return <p className="text-danger">Товар не найден.</p>;

  const reviewList = reviews ?? [];
  const purchased = (orders ?? []).some((order) =>
    order.items.some((item) => item.productId === product.id),
  );
  const alreadyRated = reviewList.some((review) => review.userId === user?.id);
  const canRate = Boolean(user) && purchased && !alreadyRated;

  const rateHint = !user
    ? 'Войдите, чтобы оценить товар'
    : !purchased
      ? 'Оценить может только тот, кто покупал этот товар'
      : 'Вы уже оценили этот товар';

  const handleRate = async (value: number) => {
    if (!user) return;
    try {
      await addRating({
        productId: product.id,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName.charAt(0)}.`,
        rating: value,
      }).unwrap();
    } catch {
      return;
    }
  };

  return (
    <div>
      <nav className="text-text-secondary mb-4 text-sm">
        <Link to="/" className="hover:text-accent">
          Каталог
        </Link>
        <span> / {product.characteristics['категория']}</span>
      </nav>

      <div className="bg-surface rounded-xl p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="aspect-square w-full rounded-lg object-contain"
            />
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={
                      index === activeImage
                        ? 'border-accent h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 p-1'
                        : 'border-border h-20 w-20 shrink-0 overflow-hidden rounded-lg border p-1'
                    }
                  >
                    <img src={image} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-h1">{product.name}</h1>
              <RatingStars
                variant="compact"
                rating={product.rating}
                count={product.ratingCount}
              />
            </div>

            <p className="text-h2 text-success mt-4 font-bold">
              {formatPrice(product.price)}
            </p>

            <div className="mt-4 flex items-center gap-4">
              <Button
                onClick={() => dispatch(addToCart(product.id))}
                aria-label="Добавить в корзину"
                className="h-11 w-48"
              >
                <BagIcon className="h-5 w-5" />
              </Button>
              <span
                className={
                  product.inStock ? 'text-success text-sm' : 'text-text-secondary text-sm'
                }
              >
                {product.inStock ? 'Есть в наличии' : 'Нет в наличии'}
              </span>
            </div>

            <h2 className="text-h3 mt-6">Описание</h2>
            <p className="text-text-secondary mt-2 text-sm">{product.description}</p>

            <h2 className="text-h3 mt-6">О товаре</h2>
            <dl className="mt-2 flex flex-col">
              {Object.entries(product.characteristics).map(([key, value]) => (
                <div
                  key={key}
                  className="border-border flex justify-between border-b py-2.5 text-sm"
                >
                  <dt className="text-text-secondary capitalize">{key}</dt>
                  <dd className="text-text text-right font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-surface mt-6 rounded-xl p-6 sm:p-8">
        <h2 className="text-h3">Оцените усы</h2>

        {canRate ? (
          <div className="mt-3">
            <RatingInput value={0} onChange={handleRate} disabled={isRating} />
          </div>
        ) : (
          <p className="text-text-secondary mt-3 text-sm">{rateHint}</p>
        )}

        {reviewList.length > 0 && (
          <ul className="divide-border border-border mt-6 flex flex-col divide-y border-t">
            {reviewList.map((review) => (
              <li
                key={review.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <RatingStars rating={review.rating} />
                  <span className="text-text text-sm">{review.userName}</span>
                </div>
                <span className="text-text-secondary text-sm">
                  {formatReviewDate(review.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
