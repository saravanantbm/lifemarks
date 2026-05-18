import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ExperienceType } from '../types';
import { useStore } from '../store/useStore';
import { EXPERIENCE_ICONS } from '../utils/helpers';

interface Props {
  open: boolean;
  onClose: () => void;
}

const TYPES: ExperienceType[] = ['Movie', 'TV Show', 'Music', 'Restaurant', 'Play', 'Art', 'Book', 'Custom'];

export function AddExperienceModal({ open, onClose }: Props) {
  const addExperience = useStore((s) => s.addExperience);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ExperienceType>('Movie');
  const [notes, setNotes] = useState('');
  const [link, setLink] = useState('');
  const [priceEstimate, setPriceEstimate] = useState('');

  function reset() {
    setTitle(''); setType('Movie'); setNotes(''); setLink(''); setPriceEstimate('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addExperience({
      title: title.trim(),
      type,
      notes: notes.trim() || undefined,
      link: link.trim() || undefined,
      priceEstimate: priceEstimate.trim() || undefined,
    });
    reset();
    onClose();
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
              <h2 className="text-xl font-bold text-white">Add Experience</h2>
              <button type="button" onClick={onClose} className="text-white/50 hover:text-white p-1">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Title *</label>
                <input
                  className="input"
                  placeholder="e.g. Spirited Away, Nobu Tokyo, Dark Side of the Moon..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                        type === t
                          ? 'bg-brand-600/30 border-brand-500/50 text-brand-300'
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <span className="text-lg">{EXPERIENCE_ICONS[t]}</span>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Notes (optional)</label>
                <textarea
                  className="textarea"
                  rows={2}
                  placeholder="Why do you want to experience this?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Link (optional)</label>
                  <input
                    className="input"
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Est. Cost (optional)</label>
                  <input
                    className="input"
                    placeholder="₹500 / $20"
                    value={priceEstimate}
                    onChange={(e) => setPriceEstimate(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full mt-2">
                Add to Want List ✦
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
