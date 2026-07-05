import { NavLink } from 'react-router-dom';

import SearchIcon from '../../assets/Search.svg?react';
import BagIcon from '../../assets/Shopping_bag.svg?react';
import UserIcon from '../../assets/User.svg?react';
import { selectCartCount } from '../../features/cart/cartSlice';
import { useAppSelector } from '../../hooks/reduxHooks';

function itemClass({ isActive }: { isActive: boolean }) {
  return `flex flex-1 flex-col items-center gap-1 py-2 text-xs ${
    isActive ? 'text-accent' : 'text-text-secondary'
  }`;
}

export function MobileNav() {
  const cartCount = useAppSelector(selectCartCount);

  return (
    <nav className="border-border bg-surface fixed inset-x-0 bottom-0 z-30 flex border-t lg:hidden">
      <NavLink to="/" end className={itemClass}>
        <SearchIcon className="h-6 w-6" />
        Главная
      </NavLink>
      <NavLink to="/" className={itemClass}>
        <BagIcon className="h-6 w-6" />
        Товары
      </NavLink>
      <NavLink to="/profile" className={itemClass}>
        <UserIcon className="h-6 w-6" />
        Профиль
      </NavLink>
      <NavLink to="/cart" className={itemClass}>
        <span className="relative">
          <BagIcon className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="bg-accent absolute -top-2 -right-2 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-semibold text-white">
              {cartCount}
            </span>
          )}
        </span>
        Корзина
      </NavLink>
    </nav>
  );
}
