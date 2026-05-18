import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useStore, useWantExperiences } from '../store/useStore';
import { ExperienceCard } from '../components/ExperienceCard';
import { AddExperienceModal } from '../components/AddExperienceModal';
import { RatingModal } from '../components/RatingModal';
import type { ExperienceType } from '../types';
import { EXPERIENCE_ICONS } from '../utils/helpers';

const ALL_TYPES: (ExperienceType | 'All')[] = ['All', 'Movie', 'TV Show', 'Music', 'Restaurant', 'Play', 'Art', 'Book', 'Custom'];

export function Experiences() {
  const wantList = useWantExperiences();
  const deleteExperience = useStore((s) => s.deleteExperience);
  const markExperienceDone = useStore((s) => s.markExperienceDone);
  const [addOpen, setAddOpen] = useState(false);
  const [ratingFor, setRatingFor] = useState<{ id: string; title: string } | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ExperienceType | 'All'>('All');

  const filtered = wantList.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || e.type === typeFilter;
    return matchSearch && matchType;
  });

  function handleMarkDone(id: string, title: string) {
    setRatingFor({ id, title });
  }

  function handleRatingSubmit(rating?: number, review?: string) {
    if (ratingFor) {
      markExperienceDone(ratingFor.id, rating, review);
      setRatingFor(null);
    }
  }

  return (
    <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Want to Experience</h1>
          <p className="text-white/40 text-sm mt-0.5">{wantList.length} items on your list</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 btn-primary py-2 px-3 text-sm"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          className="input pl-10"
          placeholder="Search experiences..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Type filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        {ALL_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
              typeFilter === t
                ? 'bg-brand-600/30 border-brand-500/50 text-brand-300'
                : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
            }`}
          >
            {t !== 'All' && <span className="text-xs">{EXPERIENCE_ICONS[t as ExperienceType]}</span>}
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-12"
          >
            <p className="text-4xl mb-3">✨</p>
            <p className="text-white font-semibold">
              {wantList.length === 0 ? 'Your list is empty' : 'Nothing matches'}
            </p>
            {wantList.length === 0 && (
              <>
                <p className="text-white/40 text-sm mt-1 mb-4">
                  Add movies, restaurants, music, and more
                </p>
                <button onClick={() => setAddOpen(true)} className="btn-primary">
                  Add First Experience
                </button>
              </>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                onMarkDone={() => handleMarkDone(exp.id, exp.title)}
                onDelete={() => deleteExperience(exp.id)}
              />
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

      <AddExperienceModal open={addOpen} onClose={() => setAddOpen(false)} />
      <RatingModal
        open={!!ratingFor}
        title={ratingFor?.title || ''}
        onClose={() => setRatingFor(null)}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}
