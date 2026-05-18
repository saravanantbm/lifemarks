import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Goal } from '../types';
import { ProgressBar } from './ProgressBar';
import { CATEGORY_COLORS, CATEGORY_ICONS, PRIORITY_COLORS, formatDate, milestoneProgress } from '../utils/helpers';

interface Props {
  goal: Goal;
  onComplete?: (id: string) => void;
}

export function GoalCard({ goal, onComplete }: Props) {
  const navigate = useNavigate();
  const progress = milestoneProgress(goal.milestones);
  const gradient = CATEGORY_COLORS[goal.category];
  const icon = CATEGORY_ICONS[goal.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card cursor-pointer group hover:border-brand-500/30 transition-all duration-200"
      onClick={() => navigate(`/goals/${goal.id}`)}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl flex-shrink-0`}>
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white text-base leading-tight truncate">{goal.title}</h3>
            <ChevronRight size={16} className="text-white/30 group-hover:text-brand-400 flex-shrink-0 mt-0.5 transition-colors" />
          </div>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[goal.priority]}`}>
              {goal.priority}
            </span>
            <span className="text-xs text-white/40">{goal.category !== 'Custom' ? goal.category : goal.customCategoryName || 'Custom'}</span>
            {goal.targetDate && (
              <span className="flex items-center gap-1 text-xs text-white/40">
                <Calendar size={11} />
                {formatDate(goal.targetDate)}
              </span>
            )}
          </div>

          {goal.milestones.length > 0 && (
            <div className="mt-3 space-y-1">
              <div className="flex justify-between items-center text-xs text-white/40">
                <span>{goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length} milestones</span>
                <span>{progress}%</span>
              </div>
              <ProgressBar value={progress} />
            </div>
          )}
        </div>
      </div>

      {goal.status === 'active' && onComplete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onComplete(goal.id);
          }}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-brand-600/30 border border-white/10 hover:border-brand-500/40 text-white/60 hover:text-brand-300 text-sm font-medium transition-all duration-150"
        >
          <CheckCircle2 size={15} />
          Mark Complete
        </button>
      )}
    </motion.div>
  );
}
