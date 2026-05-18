import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { GoalCategory, GoalPriority } from '../types';
import { useStore } from '../store/useStore';
import { CATEGORY_ICONS } from '../utils/helpers';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}

const CATEGORIES: GoalCategory[] = ['Life', 'Personal', 'Lifestyle', 'Finance', 'Family', 'Custom'];
const PRIORITIES: GoalPriority[] = ['High', 'Medium', 'Low'];

export function AddGoalModal({ open, onClose, onCreated }: Props) {
  const addGoal = useStore((s) => s.addGoal);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('Life');
  const [customName, setCustomName] = useState('');
  const [priority, setPriority] = useState<GoalPriority>('Medium');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');

  function reset() {
    setTitle(''); setDescription(''); setCategory('Life');
    setCustomName(''); setPriority('Medium'); setTargetDate(''); setNotes('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const id = addGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      customCategoryName: category === 'Custom' ? customName.trim() || undefined : undefined,
      priority,
      targetDate: targetDate || undefined,
      notes: notes.trim() || undefined,
    });
    reset();
    onClose();
    onCreated?.(id);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg glass rounded-3xl p-6 max-h-[90dvh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">New Goal</h2>
              <button type="button" onClick={onClose} className="text-white/50 hover:text-white p-1">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Title *</label>
                <input
                  className="input"
                  placeholder="e.g. Run a marathon"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                        category === cat
                          ? 'bg-brand-600/30 border-brand-500/50 text-brand-300'
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
                      {cat}
                    </button>
                  ))}
                </div>
                {category === 'Custom' && (
                  <input
                    className="input mt-2"
                    placeholder="Custom category name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                  />
                )}
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Priority</label>
                <div className="flex gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                        priority === p
                          ? p === 'High' ? 'bg-red-500/20 border-red-500/50 text-red-300'
                          : p === 'Medium' ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Target Date (optional)</label>
                <input
                  type="date"
                  className="input"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Description (optional)</label>
                <textarea
                  className="textarea"
                  rows={2}
                  placeholder="Why does this goal matter to you?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Notes (optional)</label>
                <textarea
                  className="textarea"
                  rows={2}
                  placeholder="Links, research, ideas..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary w-full mt-2">
                Create Goal ✦
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
