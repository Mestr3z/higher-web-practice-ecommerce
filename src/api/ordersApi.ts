import type { Order, PickupPoint } from '../types';
import { baseApi } from './baseApi';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPickupPoints: builder.query<PickupPoint[], void>({
      query: () => '/pickupPoints',
    }),
    getOrders: builder.query<Order[], string>({
      query: (userId) => `/orders?userId=${userId}&_sort=createdAt&_order=desc`,
      providesTags: ['Order'],
    }),
    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
    createOrder: builder.mutation<Order, Omit<Order, 'id'>>({
      query: (order) => ({ url: '/orders', method: 'POST', body: order }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetPickupPointsQuery,
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
} = ordersApi;
