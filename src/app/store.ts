import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import { baseApi } from '../api/baseApi';
import authReducer, {
  logout,
  saveUser,
  selectUser,
  setCredentials,
} from '../features/auth/authSlice';
import cartReducer, {
  clearCart,
  saveCartItems,
  selectCartItems,
} from '../features/cart/cartSlice';

const authListener = createListenerMiddleware();

authListener.startListening({
  matcher: (action) => setCredentials.match(action) || logout.match(action),
  effect: (_action, api) => {
    api.dispatch(clearCart());
  },
});

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    cart: cartReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(authListener.middleware).concat(baseApi.middleware),
});

store.subscribe(() => {
  const state = store.getState();
  saveCartItems(selectCartItems(state));
  saveUser(selectUser(state));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
