import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RequireAuth } from '../components/auth/RequireAuth';
import { MainLayout, ProfileLayout } from '../components/layout';
import { StubPage } from '../pages/_StubPage';
import { CartPage } from '../pages/CartPage';
import { CatalogPage } from '../pages/CatalogPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { EditProfilePage } from '../pages/EditProfilePage';
import { LoginPage } from '../pages/LoginPage';
import { OrdersPage } from '../pages/OrdersPage';
import { OrderSuccessPage } from '../pages/OrderSuccessPage';
import { ProductPage } from '../pages/ProductPage';
import { ProfilePage } from '../pages/ProfilePage';
import { RegisterPage } from '../pages/RegisterPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'products/:id', element: <ProductPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <ProfileLayout />,
        children: [
          { path: 'cart', element: <CartPage /> },
          {
            element: <RequireAuth />,
            children: [
              { path: 'profile', element: <ProfilePage /> },
              { path: 'profile/edit', element: <EditProfilePage /> },
              { path: 'orders', element: <OrdersPage /> },
            ],
          },
        ],
      },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order/success', element: <OrderSuccessPage /> },
      { path: '*', element: <StubPage title="Страница не найдена" /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
