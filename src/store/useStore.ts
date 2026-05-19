import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { Goal, Experience, User, Milestone } from '../types';
import * as db from '../lib/db';

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

interface AppState {
  user: User | null;
  goals: Goal[];
  experiences: Experience[];
  hasOnboarded: boolean;
  celebrationGoalId: string | null;
  dataLoading: boolean;

  // Auth / data lifecycle
  loadFromSupabase: (userId: string, email?: string) => Promise<void>;
  clearUserData: () => void;
  updateDisplayName: (name: string) => void;
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
    (set, get) => ({
      user: null,
      goals: [],
      experiences: [],
      hasOnboarded: false,
      celebrationGoalId: null,
      dataLoading: false,

      // ── Auth / data lifecycle ─────────────────────────────────────────

      loadFromSupabase: async (userId, email) => {
        set({ dataLoading: true });

        // Fetch user profile
        const profile = await db.fetchProfile(userId);
        const name = profile?.name || email?.split('@')[0] || 'Friend';
        const joinedAt = profile?.joined_at || new Date().toISOString();

        // Fetch goals + experiences in parallel
        const [goals, experiences] = await Promise.all([
          db.fetchGoals(userId),
          db.fetchExperiences(userId),
        ]);

        set({
          user: { id: userId, name, email, joinedAt },
          goals,
          experiences,
          hasOnboarded: true,
          dataLoading: false,
        });

        // Ensure profile exists
        db.upsertProfile(userId, name, joinedAt);
      },

      clearUserData: () =>
        set({ user: null, goals: [], experiences: [], hasOnboarded: false }),

      updateDisplayName: (name) => {
        const { user } = get();
        if (!user) return;
        const updated = { ...user, name };
        set({ user: updated });
        db.upsertProfile(user.id, name, user.joinedAt);
      },

      completeOnboarding: () => set({ hasOnboarded: true }),

      // ── Goals ─────────────────────────────────────────────────────────

      addGoal: (goal) => {
        const id = uid();
        const newGoal: Goal = {
          ...goal,
          id,
          milestones: [],
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ goals: [newGoal, ...s.goals] }));
        const userId = get().user?.id;
        if (userId) db.upsertGoal(userId, newGoal);
        return id;
      },

      updateGoal: (id, patch) => {
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        }));
        const goal = get().goals.find((g) => g.id === id);
        const userId = get().user?.id;
        if (goal && userId) db.upsertGoal(userId, goal);
      },

      deleteGoal: (id) => {
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
        db.deleteGoal(id);
      },

      completeGoal: (id) => {
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id
              ? { ...g, status: 'completed', completedAt: new Date().toISOString() }
              : g
          ),
          celebrationGoalId: id,
        }));
        const goal = get().goals.find((g) => g.id === id);
        const userId = get().user?.id;
        if (goal && userId) db.upsertGoal(userId, goal);
      },

      reopenGoal: (id) => {
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, status: 'active', completedAt: undefined } : g
          ),
        }));
        const goal = get().goals.find((g) => g.id === id);
        const userId = get().user?.id;
        if (goal && userId) db.upsertGoal(userId, goal);
      },

      // ── Milestones ────────────────────────────────────────────────────

      addMilestone: (goalId, milestone) => {
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? { ...g, milestones: [...g.milestones, { ...milestone, id: uid(), completed: false }] }
              : g
          ),
        }));
        const goal = get().goals.find((g) => g.id === goalId);
        const userId = get().user?.id;
        if (goal && userId) db.upsertGoal(userId, goal);
      },

      toggleMilestone: (goalId, milestoneId) => {
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
        }));
        const goal = get().goals.find((g) => g.id === goalId);
        const userId = get().user?.id;
        if (goal && userId) db.upsertGoal(userId, goal);
      },

      deleteMilestone: (goalId, milestoneId) => {
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? { ...g, milestones: g.milestones.filter((m) => m.id !== milestoneId) }
              : g
          ),
        }));
        const goal = get().goals.find((g) => g.id === goalId);
        const userId = get().user?.id;
        if (goal && userId) db.upsertGoal(userId, goal);
      },

      // ── Experiences ───────────────────────────────────────────────────

      addExperience: (exp) => {
        const newExp: Experience = {
          ...exp,
          id: uid(),
          status: 'want',
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ experiences: [newExp, ...s.experiences] }));
        const userId = get().user?.id;
        if (userId) db.upsertExperience(userId, newExp);
      },

      updateExperience: (id, patch) => {
        set((s) => ({
          experiences: s.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }));
        const exp = get().experiences.find((e) => e.id === id);
        const userId = get().user?.id;
        if (exp && userId) db.upsertExperience(userId, exp);
      },

      deleteExperience: (id) => {
        set((s) => ({ experiences: s.experiences.filter((e) => e.id !== id) }));
        db.deleteExperience(id);
      },

      markExperienceDone: (id, rating, review) => {
        set((s) => ({
          experiences: s.experiences.map((e) =>
            e.id === id
              ? { ...e, status: 'done', completedAt: new Date().toISOString(), rating, review }
              : e
          ),
        }));
        const exp = get().experiences.find((e) => e.id === id);
        const userId = get().user?.id;
        if (exp && userId) db.upsertExperience(userId, exp);
      },

      setCelebration: (goalId) => set({ celebrationGoalId: goalId }),
    }),
    {
      name: 'lifemarks-cache',
      partialize: (s) => ({
        // Only cache non-sensitive layout preferences locally
        hasOnboarded: s.hasOnboarded,
      }),
    }
  )
);

export const useActiveGoals = () => useStore(useShallow((s) => s.goals.filter((g) => g.status === 'active')));
export const useCompletedGoals = () => useStore(useShallow((s) => s.goals.filter((g) => g.status === 'completed')));
export const useWantExperiences = () => useStore(useShallow((s) => s.experiences.filter((e) => e.status === 'want')));
export const useDoneExperiences = () => useStore(useShallow((s) => s.experiences.filter((e) => e.status === 'done')));
