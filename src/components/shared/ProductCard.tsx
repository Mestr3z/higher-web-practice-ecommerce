import { Link } from 'react-router-dom';

import BagIcon from '../../assets/Shopping_bag.svg?react';
import { addToCart } from '../../features/cart/cartSlice';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { formatPrice } from '../../lib/formatPrice';
import type { Product } from '../../types';
import { Button } from '../ui';

type ProductCardProps = {
  product: Product;
  variant?: 'grid' | 'list';
};

export function ProductCard({ product, variant = 'grid' }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => dispatch(addToCart(product.id));

  if (variant === 'list') {
    return (
      <article className="flex items-center gap-4">
        <Link to={`/products/${product.id}`} className="shrink-0">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-24 w-24 rounded-lg object-contain"
          />
        </Link>

        <Link
          to={`/products/${product.id}`}
          className="text-text hover:text-accent min-w-0 flex-1 text-sm"
        >
          {product.name}
        </Link>

        <span className="text-success shrink-0 text-base font-bold">
          {formatPrice(product.price)}
        </span>

        <Button
          onClick={handleAddToCart}
          aria-label={`Добавить «${product.name}» в корзину`}
          className="h-11 w-14 shrink-0"
        >
          <BagIcon className="h-5 w-5" />
        </Button>
      </article>
    );
  }

  return (
    <article className="flex flex-col gap-3">
      <Link to={`/products/${product.id}`} className="block">
        <img
          src={product.images[0]}
          alt={product.name}
          className="aspect-square w-full rounded-lg object-contain"
        />
      </Link>

      <div className="flex flex-col gap-1">
        <Link
          to={`/products/${product.id}`}
          className="text-text hover:text-accent text-sm"
        >
          {product.name}
        </Link>
        <span className="text-success text-base font-bold">
          {formatPrice(product.price)}
        </span>
      </div>

      <Button
        fullWidth
        onClick={handleAddToCart}
        aria-label={`Добавить «${product.name}» в корзину`}
        className="h-11"
      >
        <BagIcon className="h-5 w-5" />
      </Button>
    </article>
  );
}
