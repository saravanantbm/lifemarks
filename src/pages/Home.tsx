import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Sparkles, Heart, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore, useActiveGoals, useDoneExperiences, useWantExperiences } from '../store/useStore';
import { GoalCard } from '../components/GoalCard';
import { AddGoalModal } from '../components/AddGoalModal';
import { ProgressBar } from '../components/ProgressBar';

export function Home() {
  const user = useStore((s) => s.user);
  const activeGoals = useActiveGoals();
  const doneExperiences = useDoneExperiences();
  const wantExperiences = useWantExperiences();
  const completeGoal = useStore((s) => s.completeGoal);
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const navigate = useNavigate();

  const totalMilestones = activeGoals.flatMap((g) => g.milestones);
  const doneMilestones = totalMilestones.filter((m) => m.completed);
  const overallProgress = totalMilestones.length
    ? Math.round((doneMilestones.length / totalMilestones.length) * 100)
    : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  const stats = [
    { icon: Target,   label: 'Active Goals',   value: activeGoals.length,      color: 'text-brand-400' },
    { icon: Sparkles, label: 'Want to Try',     value: wantExperiences.length,  color: 'text-pink-400' },
    { icon: Heart,    label: 'Experiences Done', value: doneExperiences.length, color: 'text-emerald-400' },
  ];

  return (
    <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-white/50 text-sm">{greeting},</p>
        <h1 className="text-3xl font-bold text-white mt-0.5">
          {firstName} <span className="text-brand-400">✦</span>
        </h1>
        <p className="text-white/40 text-sm mt-1">Mark what matters. Live what you love.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center"
          >
            <Icon size={20} className={`${color} mx-auto mb-1`} />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-[11px] text-white/40 leading-tight">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Overall progress */}
      {activeGoals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-brand-400" />
            <span className="text-sm font-semibold text-white">Overall Progress</span>
            <span className="ml-auto text-sm text-brand-300 font-bold">{overallProgress}%</span>
          </div>
          <ProgressBar value={overallProgress} />
          <p className="text-xs text-white/40 mt-2">
            {doneMilestones.length} of {totalMilestones.length} milestones completed across all goals
          </p>
        </motion.div>
      )}

      {/* Active Goals */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-white">Active Goals</h2>
        <button
          onClick={() => navigate('/goals')}
          className="text-xs text-brand-400 hover:text-brand-300 font-medium"
        >
          View all
        </button>
      </div>

      {activeGoals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-10"
        >
          <p className="text-4xl mb-3">🌟</p>
          <p className="text-white font-semibold">No goals yet</p>
          <p className="text-white/40 text-sm mt-1 mb-4">Start by adding your first life goal</p>
          <button onClick={() => setAddGoalOpen(true)} className="btn-primary">
            Add Your First Goal
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {activeGoals.slice(0, 3).map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onComplete={completeGoal}
            />
          ))}
          {activeGoals.length > 3 && (
            <button
              onClick={() => navigate('/goals')}
              className="w-full py-3 text-sm text-brand-400 hover:text-brand-300 font-medium"
            >
              + {activeGoals.length - 3} more goals
            </button>
          )}
        </div>
      )}

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setAddGoalOpen(true)}
        className="fixed bottom-24 right-5 lg:bottom-8 lg:right-8 w-14 h-14 bg-brand-600 hover:bg-brand-500 rounded-2xl shadow-lg shadow-brand-900/50 flex items-center justify-center text-white transition-colors z-40"
      >
        <Plus size={26} />
      </motion.button>

      <AddGoalModal open={addGoalOpen} onClose={() => setAddGoalOpen(false)} />
    </div>
  );
}
