import { NavLink } from 'react-router-dom';
import { Home, Target, Sparkles, Heart, Settings } from 'lucide-react';

const tabs = [
  { to: '/',            label: 'Home',     icon: Home },
  { to: '/goals',       label: 'Goals',    icon: Target },
  { to: '/experiences', label: 'Discover', icon: Sparkles },
  { to: '/lived-it',    label: 'Lived It', icon: Heart },
  { to: '/settings',    label: 'Settings', icon: Settings },
];

export function SideNav() {
  return (
    <aside className="hidden lg:flex flex-col w-56 min-h-screen glass border-r border-white/10 p-4 gap-2 fixed left-0 top-0 bottom-0 z-40">
      <div className="flex items-center gap-2 px-3 py-4 mb-4">
        <span className="text-2xl">✦</span>
        <span className="text-xl font-bold text-white tracking-tight">Lifemarks</span>
      </div>
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-150 ${
              isActive
                ? 'bg-brand-600/30 text-brand-300 border border-brand-500/30'
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </aside>
  );
}
