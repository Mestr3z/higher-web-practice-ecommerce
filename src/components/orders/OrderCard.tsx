import { useState } from 'react';
import { Link } from 'react-router-dom';

import { formatPrice } from '../../lib/formatPrice';

import type { DeliveryMethod, Order, OrderStatus, PaymentMethod } from '../../types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'В обработке',
  paid: 'Оплачен',
  processing: 'Собирается',
  shipped: 'Отправлен',
  delivered: 'Получен',
  cancelled: 'Отменён',
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  card_online: 'Оплачено картой',
  card_on_delivery: 'Оплата при получении',
  cash: 'Оплата наличными',
};

const DELIVERY_LABELS: Record<DeliveryMethod, string> = {
  courier: 'курьером',
  pickup_point: 'в пункте выдачи',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function shortNumber(value: string): string {
  return `№ ${value.slice(-4)}`;
}

function statusClass(status: OrderStatus): string {
  if (status === 'delivered') return 'text-success';
  if (status === 'cancelled') return 'text-danger';
  return 'text-text-secondary';
}

type OrderCardProps = {
  order: Order;
};

export function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="bg-surface rounded-xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <p className="text-text text-base font-bold">
            от {formatDate(order.createdAt)}
          </p>
          <span className="text-text-secondary text-sm">{shortNumber(order.number)}</span>
        </div>
        <p className="text-text shrink-0 text-base font-bold">
          {formatPrice(order.totalPrice)}
        </p>
      </div>

      <p className="mt-1 text-sm">
        <span className={`font-semibold ${statusClass(order.status)}`}>
          {STATUS_LABELS[order.status]}
        </span>
        <span className="text-text-secondary ml-2">
          {DELIVERY_LABELS[order.deliveryMethod]}
        </span>
      </p>

      <p className="text-text-secondary mt-1 text-sm">
        {PAYMENT_LABELS[order.paymentMethod]}
      </p>

      {expanded && (
        <ul className="divide-border border-border mt-4 flex flex-col divide-y border-t">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 py-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-12 w-12 shrink-0 rounded-lg object-contain"
              />
              <div className="min-w-0 flex-1">
                <Link
                  to={`/products/${item.productId}`}
                  className="text-accent hover:text-accent-hover block text-sm"
                >
                  {item.name}
                </Link>
                <span className="text-text-secondary text-xs">Параметр 1</span>
              </div>
              <span className="text-text shrink-0 text-sm font-bold">
                {formatPrice(item.price)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="text-accent hover:text-accent-hover mt-4 w-full text-center text-sm font-semibold"
      >
        {expanded ? 'Свернуть товары ↑' : 'Показать товары в заказе ↓'}
      </button>
    </article>
  );
}
