import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';

const slides = [
  {
    emoji: '✦',
    title: 'Mark what matters.',
    subtitle: 'Set life goals, track milestones, and build your personal roadmap — one step at a time.',
  },
  {
    emoji: '🎬',
    title: 'Live what you love.',
    subtitle: 'Track movies, music, restaurants, art, and every experience you want to have — or have had.',
  },
  {
    emoji: '🌟',
    title: 'Your life, celebrated.',
    subtitle: '"Run a marathon" and "watch Spirited Away" finally live side by side, meaningfully.',
  },
];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');

  const signUp = useStore((s) => s.signUp);
  const signIn = useStore((s) => s.signIn);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const authLoading = useStore((s) => s.authLoading);
  const authError = useStore((s) => s.authError);
  const clearAuthError = useStore((s) => s.clearAuthError);

  const isLast = step === slides.length - 1;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearAuthError();
    if (mode === 'signup') {
      await signUp(name.trim(), email.trim(), password);
    } else {
      await signIn(email.trim(), password);
    }
  }

  function handleSkip() {
    completeOnboarding();
  }

  function switchMode() {
    clearAuthError();
    setMode((m) => (m === 'signup' ? 'signin' : 'signup'));
  }

  return (
    <div className="min-h-dvh flex flex-col bg-[#0f0a1e] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-transparent to-purple-900/20 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-700/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-pink-700/10 blur-3xl pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-12"
        >
          <span className="text-brand-400 text-3xl font-bold">✦</span>
          <span className="text-white text-2xl font-bold tracking-tight">Lifemarks</span>
        </motion.div>

        {/* Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="text-center max-w-xs"
          >
            <p className="text-7xl mb-6">{slides[step].emoji}</p>
            <h1 className="text-3xl font-bold text-white mb-3">{slides[step].title}</h1>
            <p className="text-white/50 text-base leading-relaxed">{slides[step].subtitle}</p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2 mt-10 mb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'bg-brand-400 w-6' : 'bg-white/20 w-1.5'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        {isLast ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xs space-y-3"
          >
            <p className="text-center text-white/60 text-sm font-medium">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'signup' && (
                <input
                  className="input text-sm"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              )}
              <input
                className="input text-sm"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus={mode === 'signin'}
              />
              <div className="relative">
                <input
                  className="input text-sm pr-10"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {authError && (
                <p className="text-red-400 text-xs text-center px-1">{authError}</p>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : mode === 'signup' ? (
                  name.trim() ? `Let's go, ${name.trim().split(' ')[0]}! 🚀` : 'Create Account ✦'
                ) : (
                  'Sign In →'
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={switchMode}
              className="w-full text-center text-white/40 text-sm py-1 hover:text-white/60 transition-colors"
            >
              {mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create account'}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full text-center text-white/25 text-xs py-1 hover:text-white/40 transition-colors"
            >
              Skip for now (data stays on this device)
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="btn-primary px-10 py-3.5 text-base"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
