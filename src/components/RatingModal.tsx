import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { StarRating } from './StarRating';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (rating?: number, review?: string) => void;
}

export function RatingModal({ open, title, onClose, onSubmit }: Props) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  function handleDone() {
    onSubmit(rating > 0 ? rating : undefined, review.trim() || undefined);
    setRating(0);
    setReview('');
    onClose();
  }

  function handleSkip() {
    onSubmit(undefined, undefined);
    setRating(0);
    setReview('');
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
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-sm glass rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">How was it?</h2>
              <button type="button" onClick={onClose} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <p className="text-white/60 text-sm mb-5 truncate">✅ {title}</p>

            <div className="flex justify-center mb-5">
              <StarRating value={rating} onChange={setRating} size={36} />
            </div>

            <textarea
              className="textarea text-sm"
              placeholder="Share a quick thought... (optional, max 140 chars)"
              maxLength={140}
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <div className="text-right text-xs text-white/30 mt-1">{review.length}/140</div>

            <div className="flex gap-3 mt-4">
              <button type="button" onClick={handleSkip} className="flex-1 btn-ghost">
                Skip
              </button>
              <button type="button" onClick={handleDone} className="flex-1 btn-primary">
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
