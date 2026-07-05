import type { FormEvent } from 'react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { useCreateOrderMutation, useGetPickupPointsQuery } from '../api/ordersApi';
import { useGetProductsQuery } from '../api/productsApi';
import cartImage from '../assets/cart.png';
import { Button, FormField, Input, Select, Textarea } from '../components/ui';
import { selectUser } from '../features/auth/authSlice';
import { clearCart, selectCartItems } from '../features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { buildCart } from '../lib/cart';
import { formatPrice } from '../lib/formatPrice';
import { isRequired } from '../lib/validation';
import type { DeliveryMethod, PaymentMethod } from '../types';

type Option<T extends string> = { value: T; label: string };

const PAYMENT_OPTIONS: Option<PaymentMethod>[] = [
  { value: 'card_online', label: 'Картой онлайн' },
  { value: 'card_on_delivery', label: 'Картой при получении' },
  { value: 'cash', label: 'Наличными' },
];

const DELIVERY_OPTIONS: Option<DeliveryMethod>[] = [
  { value: 'courier', label: 'Курьером' },
  { value: 'pickup_point', label: 'В пункт выдачи' },
];

const CITY_OPTIONS = [
  { value: 'Москва', label: 'Москва' },
  { value: 'Санкт-Петербург', label: 'Санкт-Петербург' },
  { value: 'Екатеринбург', label: 'Екатеринбург' },
  { value: 'Новосибирск', label: 'Новосибирск' },
  { value: 'Казань', label: 'Казань' },
  { value: 'Нижний Новгород', label: 'Нижний Новгород' },
];

function getDeliveryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  grow = false,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  grow?: boolean;
}) {
  return (
    <div className={grow ? 'flex gap-3' : 'flex flex-wrap gap-2'}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-md border px-4 py-2.5 text-sm transition-colors ${
              grow ? 'flex-1' : ''
            } ${
              active
                ? 'border-accent bg-accent/5 text-accent font-semibold'
                : 'border-border text-text hover:border-accent'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

type CheckoutErrors = {
  phone?: string;
  city?: string;
  address?: string;
  pickup?: string;
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const entries = useAppSelector(selectCartItems);
  const { data: products } = useGetProductsQuery();
  const { data: pickupPoints } = useGetPickupPointsQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [phone, setPhone] = useState(user?.phone ?? '');
  const [comment, setComment] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('card_online');
  const [delivery, setDelivery] = useState<DeliveryMethod>('courier');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [pickupPointId, setPickupPointId] = useState('');
  const [pickupOpen, setPickupOpen] = useState(false);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitted, setSubmitted] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const cart = buildCart(entries, products ?? []);
  if (!submitted && cart.items.length === 0) return <Navigate to="/cart" replace />;

  const deliveryDate = getDeliveryDate();
  const selectedPickup = (pickupPoints ?? []).find((point) => point.id === pickupPointId);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nextErrors: CheckoutErrors = {};
    if (!isRequired(phone)) nextErrors.phone = 'Введите телефон';
    if (delivery === 'courier') {
      if (!isRequired(city)) nextErrors.city = 'Выберите город';
      if (!isRequired(address)) nextErrors.address = 'Введите адрес';
    } else if (!pickupPointId) {
      nextErrors.pickup = 'Выберите пункт выдачи';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitted(true);
      // eslint-disable-next-line react-hooks/purity
      const orderNumber = `ЗАКАЗ-${Date.now()}`;
      const created = await createOrder({
        number: orderNumber,
        userId: user.id,
        status: 'pending',
        items: cart.items.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          image: item.product.images[0],
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice: cart.totalPrice,
        paymentMethod: payment,
        deliveryMethod: delivery,
        customer: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone,
        },
        comment: comment || undefined,
        createdAt: new Date().toISOString(),
        ...(delivery === 'courier'
          ? {
              deliveryAddress: {
                country: 'Россия',
                city,
                street: address,
                house: '',
              },
            }
          : { pickupPointId }),
      }).unwrap();

      navigate('/order/success', { state: { orderId: created.id } });
      dispatch(clearCart());
    } catch {
      setSubmitted(false);
    }
  };

  return (
    <div>
      <h1 className="text-h1">Оформление заказа</h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start"
      >
        <div className="flex flex-1 flex-col gap-6">
          <section className="bg-surface rounded-xl p-6">
            <h2 className="text-h3">Способ оплаты</h2>
            <div className="mt-4">
              <Segmented
                options={PAYMENT_OPTIONS}
                value={payment}
                onChange={setPayment}
              />
            </div>
          </section>

          <section className="bg-surface rounded-xl p-6">
            <h2 className="text-h3">Способ доставки</h2>
            <div className="mt-4">
              <Segmented
                options={DELIVERY_OPTIONS}
                value={delivery}
                onChange={setDelivery}
                grow
              />
            </div>

            {delivery === 'courier' ? (
              <div className="mt-6">
                <p className="text-text mb-3 text-sm font-semibold">
                  Доставить по адресу
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="sm:w-48 sm:shrink-0">
                    <FormField label="Город" htmlFor="city" required error={errors.city}>
                      <Select
                        aria-label="Город"
                        placeholder="Город"
                        options={CITY_OPTIONS}
                        value={city}
                        onValueChange={setCity}
                      />
                    </FormField>
                  </div>
                  <div className="flex-1">
                    <FormField
                      label="Адрес"
                      htmlFor="address"
                      required
                      error={errors.address}
                    >
                      <Input
                        id="address"
                        placeholder="улица, дом, квартира"
                        value={address}
                        invalid={Boolean(errors.address)}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <div className="border-border flex items-center gap-4 rounded-md border p-3">
                  <div className="relative shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPickupOpen((open) => !open)}
                    >
                      Выбрать на карте
                    </Button>

                    {pickupOpen && (
                      <div className="border-border bg-surface absolute top-full left-0 z-10 mt-1 w-64 overflow-hidden rounded-md border shadow-lg">
                        {(pickupPoints ?? []).map((point) => (
                          <button
                            key={point.id}
                            type="button"
                            onClick={() => {
                              setPickupPointId(point.id);
                              setPickupOpen(false);
                            }}
                            className="text-text hover:bg-bg block w-full px-3 py-2 text-left text-sm"
                          >
                            {point.name} · {point.address}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-text text-sm">
                      {selectedPickup ? selectedPickup.address : 'Адрес пункта выдачи'}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {selectedPickup ? 'Пн–Вс, 10:00–22:00' : 'время работы'}
                    </p>
                  </div>
                </div>

                {errors.pickup && (
                  <p className="text-danger mt-1 text-xs">{errors.pickup}</p>
                )}
              </div>
            )}

            <p className="text-text-secondary mt-4 text-sm">
              Доставят <span className="text-text">{deliveryDate}</span>
            </p>
          </section>

          <section className="bg-surface rounded-xl p-6">
            <h2 className="text-h3">Получатель</h2>

            <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-text text-base font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-text-secondary text-sm">{user.email}</p>
              </div>

              <div className="sm:w-64">
                <FormField
                  label="Номер телефона"
                  htmlFor="phone"
                  required
                  error={errors.phone}
                >
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7"
                    value={phone}
                    invalid={Boolean(errors.phone)}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </FormField>
              </div>
            </div>

            <div className="mt-4">
              <FormField label="Комментарий к заказу" htmlFor="comment">
                <Textarea
                  id="comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FormField>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6 lg:w-80 lg:shrink-0">
          <aside className="bg-surface rounded-xl p-6">
            <h2 className="text-h3">Ваш заказ</h2>

            <div className="text-text-secondary mt-4 flex justify-between text-sm">
              <span>Сумма заказа</span>
              <span className="text-text font-bold">{formatPrice(cart.totalPrice)}</span>
            </div>

            <div className="text-text-secondary mt-2 flex justify-between text-sm">
              <span>Доставка</span>
              <span className="text-success font-semibold">бесплатно</span>
            </div>

            <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
              <span className="text-text-secondary text-sm">Итого</span>
              <span className="text-h3 text-success font-bold">
                {formatPrice(cart.totalPrice)}
              </span>
            </div>

            <Button type="submit" fullWidth className="mt-6" disabled={isLoading}>
              Оплатить
            </Button>
          </aside>

          <img src={cartImage} alt="" aria-hidden="true" className="hidden lg:block" />
        </div>
      </form>
    </div>
  );
}
