import { motion } from 'framer-motion';
import { Trash2, Calendar } from 'lucide-react';
import type { Milestone } from '../types';
import { formatDate } from '../utils/helpers';

interface Props {
  milestone: Milestone;
  onToggle: () => void;
  onDelete: () => void;
  readonly?: boolean;
}

export function MilestoneItem({ milestone, onToggle, onDelete, readonly }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="flex items-center gap-3 py-2.5 group"
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={readonly}
        className="flex-shrink-0 transition-transform active:scale-90"
      >
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          milestone.completed
            ? 'bg-brand-500 border-brand-500'
            : 'border-white/30 hover:border-brand-400'
        }`}>
          {milestone.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 bg-white rounded-full"
            />
          )}
        </div>
      </button>

      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium transition-colors ${
          milestone.completed ? 'line-through text-white/30' : 'text-white'
        }`}>
          {milestone.title}
        </span>
        {milestone.dueDate && (
          <div className="flex items-center gap-1 mt-0.5 text-xs text-white/40">
            <Calendar size={10} />
            {formatDate(milestone.dueDate)}
          </div>
        )}
      </div>

      {!readonly && (
        <button
          type="button"
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all p-1"
        >
          <Trash2 size={14} />
        </button>
      )}
    </motion.div>
  );
}
