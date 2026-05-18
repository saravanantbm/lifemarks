import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, CheckCircle2, RotateCcw, Calendar, Flag, FileText, Edit3, Check, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { MilestoneItem } from '../components/MilestoneItem';
import { ProgressBar } from '../components/ProgressBar';
import { CATEGORY_COLORS, CATEGORY_ICONS, formatDate, milestoneProgress } from '../utils/helpers';

export function GoalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const goal = useStore((s) => s.goals.find((g) => g.id === id));
  const { addMilestone, toggleMilestone, deleteMilestone, completeGoal, reopenGoal, deleteGoal, updateGoal } = useStore();

  const [newMilestone, setNewMilestone] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');
  const [addingMilestone, setAddingMilestone] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh text-white/50">
        <p>Goal not found</p>
        <button onClick={() => navigate('/goals')} className="mt-4 btn-ghost">Back to Goals</button>
      </div>
    );
  }

  const progress = milestoneProgress(goal.milestones);
  const gradient = CATEGORY_COLORS[goal.category];
  const icon = CATEGORY_ICONS[goal.category];

  function handleAddMilestone(e: React.FormEvent) {
    e.preventDefault();
    if (!newMilestone.trim()) return;
    addMilestone(goal!.id, { title: newMilestone.trim(), dueDate: milestoneDate || undefined });
    setNewMilestone('');
    setMilestoneDate('');
    setAddingMilestone(false);
  }

  function handleComplete() {
    completeGoal(goal!.id);
    navigate('/goals');
  }

  function handleDelete() {
    deleteGoal(goal!.id);
    navigate('/goals');
  }

  function handleSaveNotes() {
    updateGoal(goal!.id, { notes: notesValue.trim() || undefined });
    setEditingNotes(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero header */}
      <div className={`bg-gradient-to-br ${gradient} px-4 pt-safe-top pb-6`}>
        <div className="pt-4 flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-black/20 text-white">
            <ArrowLeft size={20} />
          </button>
          <span className="text-white/70 text-sm font-medium">Goal Detail</span>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white leading-tight">{goal.title}</h1>
            {goal.description && (
              <p className="text-white/70 text-sm mt-1">{goal.description}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className={`text-xs px-2.5 py-1 rounded-full bg-black/20 text-white`}>
            {goal.category !== 'Custom' ? goal.category : goal.customCategoryName || 'Custom'}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full bg-black/20 text-white`}>
            <Flag size={10} className="inline mr-1" />{goal.priority}
          </span>
          {goal.targetDate && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-black/20 text-white">
              <Calendar size={10} className="inline mr-1" />{formatDate(goal.targetDate)}
            </span>
          )}
          {goal.status === 'completed' && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-black/20 text-emerald-300">
              ✓ Completed {formatDate(goal.completedAt)}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 py-5 space-y-5">
        {/* Progress */}
        {goal.milestones.length > 0 && (
          <div className="card">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-white">Progress</span>
              <span className="text-brand-300 font-bold text-sm">{progress}%</span>
            </div>
            <ProgressBar value={progress} />
            <p className="text-xs text-white/40 mt-2">
              {goal.milestones.filter((m) => m.completed).length} of {goal.milestones.length} milestones done
            </p>
          </div>
        )}

        {/* Milestones */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Roadmap</h2>
            {goal.status === 'active' && (
              <button
                onClick={() => setAddingMilestone(!addingMilestone)}
                className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-medium"
              >
                <Plus size={14} /> Add Step
              </button>
            )}
          </div>

          <AnimatePresence>
            {addingMilestone && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleAddMilestone}
                className="mb-4 space-y-2 overflow-hidden"
              >
                <input
                  className="input text-sm"
                  placeholder="Milestone title..."
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  autoFocus
                />
                <input
                  type="date"
                  className="input text-sm"
                  value={milestoneDate}
                  onChange={(e) => setMilestoneDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 btn-primary py-2 text-sm">Add</button>
                  <button
                    type="button"
                    onClick={() => setAddingMilestone(false)}
                    className="btn-ghost py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {goal.milestones.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-4">
              Break this goal into steps to track progress
            </p>
          ) : (
            <div className="divide-y divide-white/5">
              <AnimatePresence>
                {goal.milestones.map((m) => (
                  <MilestoneItem
                    key={m.id}
                    milestone={m}
                    onToggle={() => toggleMilestone(goal.id, m.id)}
                    onDelete={() => deleteMilestone(goal.id, m.id)}
                    readonly={goal.status === 'completed'}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <FileText size={14} className="text-brand-400" /> Notes
            </h2>
            {!editingNotes && (
              <button
                onClick={() => { setNotesValue(goal.notes || ''); setEditingNotes(true); }}
                className="text-xs text-brand-400 hover:text-brand-300 font-medium"
              >
                <Edit3 size={14} />
              </button>
            )}
          </div>

          {editingNotes ? (
            <div className="space-y-2">
              <textarea
                className="textarea text-sm"
                rows={4}
                placeholder="Links, ideas, research, price estimates..."
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={handleSaveNotes} className="flex items-center gap-1 btn-primary py-2 text-sm flex-1">
                  <Check size={14} /> Save
                </button>
                <button onClick={() => setEditingNotes(false)} className="btn-ghost py-2 text-sm">
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/50">
              {goal.notes || <span className="italic text-white/20">No notes yet. Tap the edit icon to add some.</span>}
            </p>
          )}
        </div>

        {/* Actions */}
        {goal.status === 'active' && (
          <button
            onClick={handleComplete}
            className="w-full flex items-center justify-center gap-2 btn-primary py-3"
          >
            <CheckCircle2 size={18} /> Mark as Achieved 🎉
          </button>
        )}

        {goal.status === 'completed' && (
          <button
            onClick={() => reopenGoal(goal.id)}
            className="w-full flex items-center justify-center gap-2 btn-ghost py-3"
          >
            <RotateCcw size={16} /> Reopen Goal
          </button>
        )}

        {/* Delete */}
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 text-sm font-medium transition-all"
          >
            <Trash2 size={16} /> Delete Goal
          </button>
        ) : (
          <div className="card border-red-500/30">
            <p className="text-sm text-white text-center mb-3">Delete this goal permanently?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 btn-ghost text-sm py-2">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl px-4 py-2 text-sm transition-colors">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
