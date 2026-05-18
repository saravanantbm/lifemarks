import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useStore, useActiveGoals } from '../store/useStore';
import { GoalCard } from '../components/GoalCard';
import { AddGoalModal } from '../components/AddGoalModal';
import type { GoalCategory, GoalPriority } from '../types';
import { CATEGORY_ICONS } from '../utils/helpers';

const ALL_CATEGORIES: (GoalCategory | 'All')[] = ['All', 'Life', 'Personal', 'Lifestyle', 'Finance', 'Family', 'Custom'];

export function Goals() {
  const activeGoals = useActiveGoals();
  const completeGoal = useStore((s) => s.completeGoal);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<GoalCategory | 'All'>('All');
  const [priority, setPriority] = useState<GoalPriority | 'All'>('All');

  const filtered = activeGoals.filter((g) => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || g.category === category;
    const matchPri = priority === 'All' || g.priority === priority;
    return matchSearch && matchCat && matchPri;
  });

  return (
    <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">My Goals</h1>
          <p className="text-white/40 text-sm mt-0.5">{activeGoals.length} active goals</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 btn-primary py-2 px-3 text-sm"
        >
          <Plus size={16} /> New Goal
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          className="input pl-10"
          placeholder="Search goals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-3 scrollbar-hide">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
              category === cat
                ? 'bg-brand-600/30 border-brand-500/50 text-brand-300'
                : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
            }`}
          >
            {cat !== 'All' && <span className="text-xs">{CATEGORY_ICONS[cat as GoalCategory]}</span>}
            {cat}
          </button>
        ))}
      </div>

      {/* Priority filter */}
      <div className="flex gap-2 mb-5">
        {(['All', 'High', 'Medium', 'Low'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPriority(p)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              priority === p
                ? 'bg-brand-600/30 border-brand-500/50 text-brand-300'
                : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Goals list */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-12"
          >
            <p className="text-4xl mb-3">🎯</p>
            <p className="text-white font-semibold">
              {activeGoals.length === 0 ? 'No goals yet' : 'No goals match your filters'}
            </p>
            {activeGoals.length === 0 && (
              <button onClick={() => setAddOpen(true)} className="btn-primary mt-4">
                Create First Goal
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onComplete={completeGoal} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setAddOpen(true)}
        className="fixed bottom-24 right-5 lg:bottom-8 lg:right-8 w-14 h-14 bg-brand-600 hover:bg-brand-500 rounded-2xl shadow-lg shadow-brand-900/50 flex items-center justify-center text-white transition-colors z-40"
      >
        <Plus size={26} />
      </motion.button>

      <AddGoalModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
