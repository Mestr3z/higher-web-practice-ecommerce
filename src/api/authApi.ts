import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import type { LoginPayload, RegisterPayload, UpdateProfilePayload, User } from '../types';
import { baseApi } from './baseApi';

type StoredUser = User & { password: string };

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<User, LoginPayload>({
      async queryFn(credentials, _api, _extraOptions, baseQuery) {
        const result = await baseQuery(
          `/users?email=${encodeURIComponent(credentials.email)}`,
        );
        if (result.error) return { error: result.error };

        const users = result.data as StoredUser[];
        const match = users.find((user) => user.password === credentials.password);
        if (!match) {
          return {
            error: {
              status: 401,
              data: 'Неверный email или пароль',
            } as FetchBaseQueryError,
          };
        }

        const { password: _password, ...user } = match;
        return { data: user };
      },
    }),

    register: builder.mutation<User, RegisterPayload>({
      async queryFn(payload, _api, _extraOptions, baseQuery) {
        const existing = await baseQuery(
          `/users?email=${encodeURIComponent(payload.email)}`,
        );
        if (existing.error) return { error: existing.error };
        if ((existing.data as StoredUser[]).length > 0) {
          return {
            error: {
              status: 409,
              data: 'Пользователь с таким email уже существует',
            } as FetchBaseQueryError,
          };
        }

        const created = await baseQuery({
          url: '/users',
          method: 'POST',
          body: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            password: payload.password,
            createdAt: new Date().toISOString(),
          },
        });
        if (created.error) return { error: created.error };

        const { password: _password, ...user } = created.data as StoredUser;
        return { data: user };
      },
    }),

    updateProfile: builder.mutation<User, { id: string; changes: UpdateProfilePayload }>({
      async queryFn({ id, changes }, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: `/users/${id}`,
          method: 'PATCH',
          body: changes,
        });
        if (result.error) return { error: result.error };

        const { password: _password, ...user } = result.data as StoredUser;
        return { data: user };
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useUpdateProfileMutation } =
  authApi;
