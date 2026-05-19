import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import { CelebrationOverlay } from './components/CelebrationOverlay';
import { AuthPage } from './pages/AuthPage';
import { Home } from './pages/Home';
import { Goals } from './pages/Goals';
import { GoalDetail } from './pages/GoalDetail';
import { Experiences } from './pages/Experiences';
import { LivedIt } from './pages/LivedIt';
import { Settings } from './pages/Settings';

function AppRoutes() {
  const { session, loading } = useAuth();
  const dataLoading = useStore((s) => s.dataLoading);

  // Full-screen spinner while Supabase session resolves
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center">
        <Loader2 size={32} className="text-brand-500 animate-spin" />
      </div>
    );
  }

  // Not logged in → show auth page
  if (!session) return <AuthPage />;

  // Logged in but still fetching data from Supabase
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="text-brand-500 animate-spin" />
        <p className="text-white/40 text-sm">Loading your data…</p>
      </div>
    );
  }

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
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
