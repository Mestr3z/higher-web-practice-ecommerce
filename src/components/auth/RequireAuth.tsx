import { Navigate, Outlet } from 'react-router-dom';

import { selectIsAuthenticated } from '../../features/auth/authSlice';
import { useAppSelector } from '../../hooks/reduxHooks';

export function RequireAuth() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
