import { Outlet } from 'react-router-dom';

import { Header } from './Header';
import { MobileNav } from './MobileNav';

export function MainLayout() {
  return (
    <div className="bg-bg min-h-screen">
      <Header />
      <main className="mx-auto max-w-[1440px] px-5 pt-6 pb-24 lg:px-10 lg:pb-6">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
