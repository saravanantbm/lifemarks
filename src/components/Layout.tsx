import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { SideNav } from './SideNav';

export function Layout() {
  return (
    <div className="min-h-dvh bg-[#0f0a1e]">
      <SideNav />
      <main className="lg:ml-56 pb-24 lg:pb-6 min-h-dvh">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
