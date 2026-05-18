import type { GoalCategory, ExperienceType } from '../types';

export function formatDate(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function milestoneProgress(milestones: { completed: boolean }[]): number {
  if (!milestones.length) return 0;
  return Math.round((milestones.filter((m) => m.completed).length / milestones.length) * 100);
}

export const CATEGORY_COLORS: Record<GoalCategory, string> = {
  Life:      'from-purple-600 to-indigo-600',
  Personal:  'from-pink-600 to-rose-500',
  Lifestyle: 'from-emerald-600 to-teal-500',
  Finance:   'from-amber-500 to-orange-500',
  Family:    'from-sky-500 to-blue-600',
  Custom:    'from-fuchsia-600 to-violet-600',
};

export const CATEGORY_ICONS: Record<GoalCategory, string> = {
  Life:      '🌟',
  Personal:  '🌱',
  Lifestyle: '🎯',
  Finance:   '💰',
  Family:    '👨‍👩‍👧',
  Custom:    '✨',
};

export const EXPERIENCE_ICONS: Record<ExperienceType, string> = {
  Movie:      '🎬',
  'TV Show':  '📺',
  Music:      '🎵',
  Restaurant: '🍽️',
  Play:       '🎭',
  Art:        '🎨',
  Book:       '📚',
  Custom:     '⭐',
};

export const PRIORITY_COLORS = {
  High:   'bg-red-500/20 text-red-300 border border-red-500/30',
  Medium: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  Low:    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
};
