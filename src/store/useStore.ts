import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Goal, Experience, User, Milestone } from '../types';

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

interface AppState {
  user: User | null;
  goals: Goal[];
  experiences: Experience[];
  hasOnboarded: boolean;
  celebrationGoalId: string | null;

  // Auth
  signIn: (name: string, email?: string) => void;
  signOut: () => void;
  completeOnboarding: () => void;

  // Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'milestones' | 'status'>) => string;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  completeGoal: (id: string) => void;
  reopenGoal: (id: string) => void;

  // Milestones
  addMilestone: (goalId: string, milestone: Omit<Milestone, 'id' | 'completed'>) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;

  // Experiences
  addExperience: (exp: Omit<Experience, 'id' | 'createdAt' | 'status'>) => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  markExperienceDone: (id: string, rating?: number, review?: string) => void;

  // Celebration
  setCelebration: (goalId: string | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      goals: [],
      experiences: [],
      hasOnboarded: false,
      celebrationGoalId: null,

      signIn: (name, email) =>
        set({
          user: { id: uid(), name, email, joinedAt: new Date().toISOString() },
          hasOnboarded: true,
        }),

      signOut: () => set({ user: null }),

      completeOnboarding: () => set({ hasOnboarded: true }),

      addGoal: (goal) => {
        const id = uid();
        set((s) => ({
          goals: [
            {
              ...goal,
              id,
              milestones: [],
              status: 'active',
              createdAt: new Date().toISOString(),
            },
            ...s.goals,
          ],
        }));
        return id;
      },

      updateGoal: (id, patch) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        })),

      deleteGoal: (id) =>
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      completeGoal: (id) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id
              ? { ...g, status: 'completed', completedAt: new Date().toISOString() }
              : g
          ),
          celebrationGoalId: id,
        })),

      reopenGoal: (id) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, status: 'active', completedAt: undefined } : g
          ),
        })),

      addMilestone: (goalId, milestone) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  milestones: [
                    ...g.milestones,
                    { ...milestone, id: uid(), completed: false },
                  ],
                }
              : g
          ),
        })),

      toggleMilestone: (goalId, milestoneId) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  milestones: g.milestones.map((m) =>
                    m.id === milestoneId
                      ? {
                          ...m,
                          completed: !m.completed,
                          completedAt: !m.completed ? new Date().toISOString() : undefined,
                        }
                      : m
                  ),
                }
              : g
          ),
        })),

      deleteMilestone: (goalId, milestoneId) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? { ...g, milestones: g.milestones.filter((m) => m.id !== milestoneId) }
              : g
          ),
        })),

      addExperience: (exp) =>
        set((s) => ({
          experiences: [
            { ...exp, id: uid(), status: 'want', createdAt: new Date().toISOString() },
            ...s.experiences,
          ],
        })),

      updateExperience: (id, patch) =>
        set((s) => ({
          experiences: s.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),

      deleteExperience: (id) =>
        set((s) => ({ experiences: s.experiences.filter((e) => e.id !== id) })),

      markExperienceDone: (id, rating, review) =>
        set((s) => ({
          experiences: s.experiences.map((e) =>
            e.id === id
              ? {
                  ...e,
                  status: 'done',
                  completedAt: new Date().toISOString(),
                  rating,
                  review,
                }
              : e
          ),
        })),

      setCelebration: (goalId) => set({ celebrationGoalId: goalId }),
    }),
    {
      name: 'lifemarks-data',
      partialize: (s) => ({
        user: s.user,
        goals: s.goals,
        experiences: s.experiences,
        hasOnboarded: s.hasOnboarded,
      }),
    }
  )
);

export const useActiveGoals = () => useStore((s) => s.goals.filter((g) => g.status === 'active'));
export const useCompletedGoals = () => useStore((s) => s.goals.filter((g) => g.status === 'completed'));
export const useWantExperiences = () => useStore((s) => s.experiences.filter((e) => e.status === 'want'));
export const useDoneExperiences = () => useStore((s) => s.experiences.filter((e) => e.status === 'done'));
