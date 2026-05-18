import { NavLink } from 'react-router-dom';
import { Home, Target, Sparkles, Heart, Settings } from 'lucide-react';

const tabs = [
  { to: '/',            label: 'Home',        icon: Home },
  { to: '/goals',       label: 'Goals',       icon: Target },
  { to: '/experiences', label: 'Discover',    icon: Sparkles },
  { to: '/lived-it',    label: 'Lived It',    icon: Heart },
  { to: '/settings',    label: 'Settings',    icon: Settings },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 safe-bottom lg:hidden">
      <ul className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-1 rounded-xl transition-colors duration-150 ${
                  isActive ? 'text-brand-400' : 'text-white/40 hover:text-white/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="text-[10px] font-medium">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
