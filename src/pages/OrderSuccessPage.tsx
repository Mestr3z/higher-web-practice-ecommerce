import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useGetOrderQuery, useGetPickupPointsQuery } from '../api/ordersApi';
import { Button } from '../components/ui';
import { formatPrice } from '../lib/formatPrice';
import type { PaymentMethod } from '../types';

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  card_online: 'Оплачено картой',
  card_on_delivery: 'Оплата картой при получении',
  cash: 'Оплата наличными',
};

function formatDate(iso: string, addDays = 0): string {
  const date = new Date(iso);
  date.setDate(date.getDate() + addDays);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { orderId?: string } | null;
  const orderId = state?.orderId;

  const { data: order, isLoading } = useGetOrderQuery(orderId ?? '', { skip: !orderId });
  const { data: pickupPoints } = useGetPickupPointsQuery();

  if (!orderId) return <Navigate to="/" replace />;
  if (isLoading) return <p className="text-text-secondary">Загрузка…</p>;
  if (!order) return <p className="text-danger">Заказ не найден.</p>;

  const pickup = pickupPoints?.find((point) => point.id === order.pickupPointId);
  const isPickup = order.deliveryMethod === 'pickup_point';

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-h1">Спасибо за покупку!</h1>
      <p className="text-h3 text-text mt-3 font-semibold">
        Мы уже готовим выбранные усы к отправке!
      </p>

      <div className="bg-surface mt-8 rounded-xl p-6 sm:p-8">
        <h2 className="text-h3">Получатель</h2>
        <div className="mt-3 flex flex-col gap-1">
          <p className="text-text text-base font-medium">
            {order.customer.firstName} {order.customer.lastName}
          </p>
          <p className="text-text-secondary text-sm break-all">{order.customer.email}</p>
          <p className="text-text-secondary text-sm">{order.customer.phone}</p>
        </div>
        {order.comment && (
          <p className="text-text-secondary mt-3 text-base">{order.comment}</p>
        )}

        <div className="border-border mt-6 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:gap-12">
          <div>
            <p className="text-text-secondary text-sm">
              {isPickup ? 'Пункт выдачи' : 'Адрес доставки'}
            </p>
            <p className="text-text mt-1 text-base">
              {isPickup
                ? (pickup?.address ?? 'Пункт выдачи')
                : `${order.deliveryAddress?.city ?? ''}, ${order.deliveryAddress?.street ?? ''}`}
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-sm">
              {isPickup ? 'Забирать после' : 'Дата доставки'}
            </p>
            <p className="text-text mt-1 text-base">{formatDate(order.createdAt, 3)}</p>
          </div>
        </div>

        <ul className="border-border mt-6 flex flex-col gap-4 border-t pt-6">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 shrink-0 rounded-lg object-contain"
              />
              <Link
                to={`/products/${item.productId}`}
                className="text-accent hover:text-accent-hover min-w-0 flex-1 text-base"
              >
                {item.name}
              </Link>
              <div className="shrink-0 text-right">
                <p className="text-text text-base font-bold">{formatPrice(item.price)}</p>
                <p className="text-text-secondary text-sm">{item.quantity} шт.</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="border-border mt-6 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:gap-12">
          <div>
            <p className="text-text-secondary text-sm">Общая сумма</p>
            <p className="text-h2 text-text mt-1 font-bold">
              {formatPrice(order.totalPrice)}
            </p>
          </div>
          <div>
            <p className="text-text-secondary text-sm">Способ оплаты</p>
            <p className="text-text mt-1 text-base">
              {PAYMENT_LABELS[order.paymentMethod]}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" onClick={() => window.print()}>
          Распечатать
        </Button>
        <Link
          to="/orders"
          className="text-accent hover:text-accent-hover text-center text-base font-semibold"
        >
          История заказов
        </Link>
      </div>

      <Button fullWidth className="mt-6" onClick={() => navigate('/')}>
        Вернуться к покупкам
      </Button>
    </div>
  );
}
