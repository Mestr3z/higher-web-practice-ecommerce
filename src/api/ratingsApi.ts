import type { ProductRating } from '../types';
import { baseApi } from './baseApi';

type Review = ProductRating & { id: string };

type AddRatingPayload = {
  productId: string;
  userId: string;
  userName: string;
  rating: number;
};

export const ratingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRatingsByProduct: builder.query<Review[], string>({
      query: (productId) => `/ratings?productId=${productId}&_sort=createdAt&_order=desc`,
      providesTags: (_result, _error, productId) => [{ type: 'Rating', id: productId }],
    }),
    addRating: builder.mutation<Review, AddRatingPayload>({
      async queryFn(payload, _api, _extraOptions, baseQuery) {
        const created = await baseQuery({
          url: '/ratings',
          method: 'POST',
          body: { ...payload, createdAt: new Date().toISOString() },
        });
        if (created.error) return { error: created.error };

        const all = await baseQuery(`/ratings?productId=${payload.productId}`);
        if (all.error) return { error: all.error };

        const ratings = all.data as Review[];
        const ratingCount = ratings.length;
        const average =
          ratings.reduce((sum, item) => sum + item.rating, 0) / (ratingCount || 1);
        const rating = Math.round(average * 10) / 10;

        const patched = await baseQuery({
          url: `/products/${payload.productId}`,
          method: 'PATCH',
          body: { rating, ratingCount },
        });
        if (patched.error) return { error: patched.error };

        return { data: created.data as Review };
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Rating', id: arg.productId },
        { type: 'Product', id: arg.productId },
      ],
    }),
  }),
});

export const { useGetRatingsByProductQuery, useAddRatingMutation } = ratingsApi;
