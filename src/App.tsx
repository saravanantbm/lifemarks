import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useStore } from './store/useStore';
import { initAnalytics, track } from './lib/analytics';
import { setupPushNotifications } from './lib/notifications';

initAnalytics();
import { Layout } from './components/Layout';
import { CelebrationOverlay } from './components/CelebrationOverlay';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Goals } from './pages/Goals';
import { GoalDetail } from './pages/GoalDetail';
import { Experiences } from './pages/Experiences';
import { LivedIt } from './pages/LivedIt';
import { Settings } from './pages/Settings';

function Splash() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#0f0a1e]">
      <div className="text-center">
        <p className="text-brand-400 text-5xl font-bold animate-pulse">✦</p>
        <p className="text-white/30 text-sm mt-4 tracking-widest uppercase">Lifemarks</p>
      </div>
    </div>
  );
}

function PageTracker() {
  const location = useLocation();
  useEffect(() => {
    track('Page Viewed', { path: location.pathname });
  }, [location.pathname]);
  return null;
}

function AppRoutes() {
  const user = useStore((s) => s.user);
  const authInitialized = useStore((s) => s.authInitialized);

  useEffect(() => {
    if (user?.id) {
      const timer = setTimeout(() => setupPushNotifications(user.id), 1500);
      return () => clearTimeout(timer);
    }
  }, [user?.id]);

  if (!authInitialized) return <Splash />;
  if (!user) return <Onboarding />;

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/goals/:id" element={<GoalDetail />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/lived-it" element={<LivedIt />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <CelebrationOverlay />
    </>
  );
}

export default function App() {
  const initAuth = useStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <PageTracker />
      <AppRoutes />
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  );
}
