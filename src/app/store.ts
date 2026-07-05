import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from '../api/baseApi';
import authReducer, { saveUser, selectUser } from '../features/auth/authSlice';
import cartReducer, { saveCartItems, selectCartItems } from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    cart: cartReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

store.subscribe(() => {
  const state = store.getState();
  saveCartItems(selectCartItems(state));
  saveUser(selectUser(state));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
