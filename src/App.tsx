import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import { CelebrationOverlay } from './components/CelebrationOverlay';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Goals } from './pages/Goals';
import { GoalDetail } from './pages/GoalDetail';
import { Experiences } from './pages/Experiences';
import { LivedIt } from './pages/LivedIt';
import { Settings } from './pages/Settings';

function AppRoutes() {
  const hasOnboarded = useStore((s) => s.hasOnboarded);

  if (!hasOnboarded) return <Onboarding />;

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
      <AppRoutes />
    </BrowserRouter>
  );
}
