import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const signIn = useStore((s) => s.signIn);

  function handleExplore() {
    completeOnboarding();
  }

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) {
      signIn(name.trim());
    } else {
      completeOnboarding();
    }
  }

  const isLast = step === slides.length - 1;

  return (
    <div className="min-h-dvh flex flex-col bg-[#0f0a1e] relative overflow-hidden">
      {/* Background glow */}
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
            <form onSubmit={handleSignIn} className="space-y-3">
              <input
                className="input text-base"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button type="submit" className="btn-primary w-full py-3.5 text-base">
                {name.trim() ? "Let's go, " + name.trim().split(' ')[0] + '! 🚀' : 'Start Exploring ✦'}
              </button>
            </form>
            <button
              type="button"
              onClick={handleExplore}
              className="w-full text-center text-white/40 text-sm py-2 hover:text-white/60 transition-colors"
            >
              Skip for now
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
