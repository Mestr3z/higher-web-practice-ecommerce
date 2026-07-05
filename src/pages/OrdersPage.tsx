import { useGetOrdersQuery } from '../api/ordersApi';
import { OrderCard } from '../components/orders';
import { selectUser } from '../features/auth/authSlice';
import { useAppSelector } from '../hooks/reduxHooks';

export function OrdersPage() {
  const user = useAppSelector(selectUser);
  const { data: orders, isLoading } = useGetOrdersQuery(user?.id ?? '', {
    skip: !user,
  });

  return (
    <div>
      <h1 className="text-h2">История заказов</h1>

      {isLoading && <p className="text-text-secondary mt-6">Загрузка…</p>}

      {orders && orders.length === 0 && (
        <div className="bg-surface text-text-secondary mt-6 rounded-xl p-6">
          У вас пока нет заказов.
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="mt-6 flex flex-col gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
