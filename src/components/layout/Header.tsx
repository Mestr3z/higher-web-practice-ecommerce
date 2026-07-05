import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import LogoFull from '../../assets/Logo-Full.svg?react';
import SearchIcon from '../../assets/Search.svg?react';
import BagIcon from '../../assets/Shopping_bag.svg?react';
import UserIcon from '../../assets/User.svg?react';
import { selectUser } from '../../features/auth/authSlice';
import { selectCartCount } from '../../features/cart/cartSlice';
import { useAppSelector } from '../../hooks/reduxHooks';

import type { FormEvent } from 'react';

export function Header() {
  const navigate = useNavigate();
  const cartCount = useAppSelector(selectCartCount);
  const user = useAppSelector(selectUser);
  const [query, setQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/?search=${encodeURIComponent(trimmed)}` : '/');
  };

  return (
    <header className="border-border bg-surface border-b">
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-5 py-4 lg:gap-8 lg:px-10">
        <Link to="/" className="shrink-0" aria-label="Quant — на главную">
          <LogoFull className="h-9 w-auto lg:h-10" />
        </Link>

        <Link
          to="/"
          className="bg-accent hover:bg-accent-hover hidden shrink-0 rounded-md px-5 py-3 text-sm font-semibold text-white transition-colors lg:block"
        >
          Каталог
        </Link>

        <form
          role="search"
          onSubmit={handleSearch}
          className="border-border focus-within:border-accent flex min-w-0 flex-1 overflow-hidden rounded-md border"
        >
          <input
            type="search"
            placeholder="Искать"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full min-w-0 px-4 py-2.5 text-sm outline-none lg:py-3"
          />
          <button
            type="submit"
            aria-label="Найти"
            className="bg-accent grid w-11 shrink-0 place-items-center text-white lg:w-12"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </form>

        <nav className="hidden shrink-0 items-center gap-8 lg:flex">
          <Link
            to={user ? '/profile' : '/login'}
            className="text-text-secondary hover:text-accent flex flex-col items-center gap-1"
          >
            <UserIcon className="h-6 w-6" />
            <span className="text-xs">{user ? user.firstName : 'Войти'}</span>
          </Link>

          <Link
            to="/cart"
            className="text-text-secondary hover:text-accent flex flex-col items-center gap-1"
          >
            <span className="relative">
              <BagIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="bg-accent absolute -top-2 -right-2 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </span>
            <span className="text-xs">Корзина</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
