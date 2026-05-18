import { motion } from 'framer-motion';
import { CheckCircle2, Trash2, ExternalLink } from 'lucide-react';
import type { Experience } from '../types';
import { EXPERIENCE_ICONS } from '../utils/helpers';
import { StarRating } from './StarRating';

interface Props {
  experience: Experience;
  onMarkDone?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function ExperienceCard({ experience, onMarkDone, onDelete }: Props) {
  const icon = EXPERIENCE_ICONS[experience.type];
  const isDone = experience.status === 'done';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`card group transition-all duration-200 ${isDone ? 'border-brand-500/20' : 'hover:border-white/20'}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
          isDone ? 'bg-brand-600/20' : 'bg-white/10'
        }`}>
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={`font-semibold text-sm leading-tight ${isDone ? 'text-white/70' : 'text-white'}`}>
                {experience.title}
              </h3>
              <span className="text-xs text-white/40">{experience.type}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {experience.link && (
                <a
                  href={experience.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 text-white/30 hover:text-brand-400 transition-colors"
                >
                  <ExternalLink size={14} />
                </a>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="p-1.5 text-white/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          {isDone && experience.rating != null && (
            <div className="mt-1.5">
              <StarRating value={experience.rating} readonly size={14} />
              {experience.review && (
                <p className="text-xs text-white/40 mt-1 italic">"{experience.review}"</p>
              )}
            </div>
          )}

          {experience.notes && (
            <p className="text-xs text-white/40 mt-1.5 line-clamp-2">{experience.notes}</p>
          )}
        </div>
      </div>

      {!isDone && onMarkDone && (
        <button
          type="button"
          onClick={onMarkDone}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-brand-600/30 border border-white/10 hover:border-brand-500/40 text-white/60 hover:text-brand-300 text-sm font-medium transition-all duration-150"
        >
          <CheckCircle2 size={14} />
          Mark as Done
        </button>
      )}
    </motion.div>
  );
}
