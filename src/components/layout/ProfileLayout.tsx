import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { logout, selectUser } from '../../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';

const linkBase = 'block rounded-md px-4 py-2.5 text-sm transition-colors';

function navClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? `${linkBase} bg-surface font-semibold text-accent`
    : `${linkBase} text-text-secondary hover:text-accent`;
}

export function ProfileLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="lg:border-border hidden lg:block lg:w-56 lg:shrink-0 lg:border-r lg:pr-6">
        <nav className="flex flex-col gap-1">
          <NavLink to="/profile" end className={navClass}>
            Мой профиль
          </NavLink>
          <NavLink to="/orders" className={navClass}>
            История заказов
          </NavLink>
          <NavLink to="/cart" className={navClass}>
            Корзина
          </NavLink>
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className={`${linkBase} text-text-secondary hover:text-danger text-left`}
            >
              Выйти
            </button>
          )}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        {user && (
          <button
            type="button"
            onClick={handleLogout}
            className="text-danger mb-4 text-sm font-semibold lg:hidden"
          >
            Выйти
          </button>
        )}
        <Outlet />
      </div>
    </div>
  );
}
