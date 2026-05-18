import { motion, AnimatePresence } from 'framer-motion';
import { useStore, useCompletedGoals, useDoneExperiences } from '../store/useStore';
import { GoalCard } from '../components/GoalCard';
import { ExperienceCard } from '../components/ExperienceCard';
import { useState } from 'react';
import { formatDate } from '../utils/helpers';

type Tab = 'goals' | 'experiences';

export function LivedIt() {
  const completedGoals = useCompletedGoals();
  const doneExperiences = useDoneExperiences();
  const deleteExperience = useStore((s) => s.deleteExperience);
  const [tab, setTab] = useState<Tab>('goals');

  const totalAchievements = completedGoals.length + doneExperiences.length;
  const avgRating =
    doneExperiences.filter((e) => e.rating != null).length > 0
      ? (
          doneExperiences.reduce((s, e) => s + (e.rating ?? 0), 0) /
          doneExperiences.filter((e) => e.rating != null).length
        ).toFixed(1)
      : null;

  return (
    <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Lived It</h1>
        <p className="text-white/40 text-sm mt-0.5">Your life's greatest hits</p>
      </div>

      {/* Hero stats */}
      {totalAchievements > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-5 bg-gradient-to-br from-brand-900/60 to-purple-900/40"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">🏆</div>
            <div>
              <p className="text-3xl font-bold text-white">{totalAchievements}</p>
              <p className="text-white/50 text-sm">Total Achievements</p>
              {avgRating && (
                <p className="text-amber-300 text-sm mt-0.5">
                  ★ {avgRating} avg rating
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(['goals', 'experiences'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
              tab === t
                ? 'bg-brand-600/30 border-brand-500/50 text-brand-300'
                : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
            }`}
          >
            {t === 'goals' ? `🎯 Goals (${completedGoals.length})` : `✨ Experiences (${doneExperiences.length})`}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'goals' ? (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-3"
          >
            {completedGoals.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-white font-semibold">No completed goals yet</p>
                <p className="text-white/40 text-sm mt-1">Completed goals will appear here</p>
              </div>
            ) : (
              completedGoals.map((goal) => (
                <div key={goal.id} className="relative">
                  <GoalCard goal={goal} />
                  {goal.completedAt && (
                    <p className="text-xs text-white/30 text-right mt-1 pr-1">
                      Completed {formatDate(goal.completedAt)}
                    </p>
                  )}
                </div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="experiences"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-3"
          >
            {doneExperiences.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-4xl mb-3">✨</p>
                <p className="text-white font-semibold">No experiences logged yet</p>
                <p className="text-white/40 text-sm mt-1">Mark experiences as done to see them here</p>
              </div>
            ) : (
              doneExperiences.map((exp) => (
                <div key={exp.id}>
                  <ExperienceCard
                    experience={exp}
                    onDelete={() => deleteExperience(exp.id)}
                  />
                  {exp.completedAt && (
                    <p className="text-xs text-white/30 text-right mt-1 pr-1">
                      Experienced {formatDate(exp.completedAt)}
                    </p>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
