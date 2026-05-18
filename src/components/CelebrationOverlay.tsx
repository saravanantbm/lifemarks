import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useStore } from '../store/useStore';

export function CelebrationOverlay() {
  const celebrationGoalId = useStore((s) => s.celebrationGoalId);
  const setCelebration = useStore((s) => s.setCelebration);
  const goal = useStore((s) => s.goals.find((g) => g.id === celebrationGoalId));
  const fired = useRef(false);

  useEffect(() => {
    if (!celebrationGoalId || fired.current) return;
    fired.current = true;

    const end = Date.now() + 2200;
    const colors = ['#a78bfa', '#7c3aed', '#f472b6', '#34d399', '#fbbf24'];

    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    const timer = setTimeout(() => {
      setCelebration(null);
      fired.current = false;
    }, 3500);
    return () => clearTimeout(timer);
  }, [celebrationGoalId, setCelebration]);

  return (
    <AnimatePresence>
      {celebrationGoalId && goal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          <div className="glass rounded-3xl p-8 text-center max-w-xs mx-4 pointer-events-auto shadow-2xl border border-brand-500/30">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-1">Goal Achieved!</h2>
            <p className="text-brand-300 font-medium">{goal.title}</p>
            <p className="text-white/50 text-sm mt-1">Added to your Lived It history</p>
            <button
              onClick={() => { setCelebration(null); fired.current = false; }}
              className="mt-4 btn-primary w-full"
            >
              Awesome! 🙌
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
