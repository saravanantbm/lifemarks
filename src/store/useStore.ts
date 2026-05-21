import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { Goal, Experience, User, Milestone } from '../types';
import { supabase } from '../lib/supabase';
import {
  dbLoadGoals, dbInsertGoal, dbUpdateGoal, dbDeleteGoal,
  dbLoadExperiences, dbInsertExperience, dbUpdateExperience, dbDeleteExperience,
} from '../lib/db';
import { identifyUser, track, resetAnalytics } from '../lib/analytics';

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

interface AppState {
  user: User | null;
  goals: Goal[];
  experiences: Experience[];
  hasOnboarded: boolean;
  celebrationGoalId: string | null;
  authLoading: boolean;
  authError: string | null;
  authInitialized: boolean;

  // Auth
  initAuth: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
  completeOnboarding: () => void;
  clearAuthError: () => void;

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
      authLoading: false,
      authError: null,
      authInitialized: false,

      // ── Auth ──────────────────────────────────────────────────────────────

      initAuth: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const [goals, experiences] = await Promise.all([
            dbLoadGoals(session.user.id),
            dbLoadExperiences(session.user.id),
          ]);
          set({
            user: {
              id: session.user.id,
              name: session.user.user_metadata?.name ?? session.user.email ?? 'User',
              email: session.user.email,
              joinedAt: session.user.created_at,
            },
            goals,
            experiences,
            hasOnboarded: true,
          });
        }
        set({ authInitialized: true });
      },

      signUp: async (name, email, password) => {
        set({ authLoading: true, authError: null });
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error || !data.user) {
          const msg = error?.message ?? 'Sign-up failed';
          set({ authLoading: false, authError: msg });
          return msg;
        }
        // Upload any locally created goals/experiences to cloud
        const state = get();
        await Promise.all([
          supabase.from('profiles').upsert({ id: data.user!.id, name, email }),
          ...state.goals.map((g) => dbInsertGoal(g, data.user!.id).catch(() => {})),
          ...state.experiences.map((e) => dbInsertExperience(e, data.user!.id).catch(() => {})),
        ]);
        const userId = data.user.id;
        identifyUser(userId, { name, email });
        track('Signed Up');
        set({
          user: { id: userId, name, email, joinedAt: data.user.created_at },
          hasOnboarded: true,
          authLoading: false,
        });
        return null;
      },

      signIn: async (email, password) => {
        set({ authLoading: true, authError: null });
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.user) {
          const msg = error?.message ?? 'Sign-in failed';
          set({ authLoading: false, authError: msg });
          return msg;
        }
        const [goals, experiences] = await Promise.all([
          dbLoadGoals(data.user.id),
          dbLoadExperiences(data.user.id),
        ]);
        const name = data.user.user_metadata?.name ?? email;
        identifyUser(data.user.id, { name, email });
        track('Signed In');
        set({
          user: { id: data.user.id, name, email, joinedAt: data.user.created_at },
          goals,
          experiences,
          hasOnboarded: true,
          authLoading: false,
        });
        return null;
      },

      signOut: async () => {
        track('Signed Out');
        resetAnalytics();
        await supabase.auth.signOut();
        set({ user: null, goals: [], experiences: [] });
      },

      updateProfileName: async (name) => {
        await supabase.auth.updateUser({ data: { name } });
        set((s) => ({ user: s.user ? { ...s.user, name } : null }));
      },

      completeOnboarding: () => set({ hasOnboarded: true }),
      clearAuthError: () => set({ authError: null }),

      // ── Goals ─────────────────────────────────────────────────────────────

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
        track('Goal Created', { category: goal.category, priority: goal.priority });
        const { user } = get();
        if (user) dbInsertGoal(newGoal, user.id).catch(console.error);
        return id;
      },

      updateGoal: (id, patch) => {
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        }));
        const { user } = get();
        if (user) dbUpdateGoal(id, patch).catch(console.error);
      },

      deleteGoal: (id) => {
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
        const { user } = get();
        if (user) dbDeleteGoal(id).catch(console.error);
      },

      completeGoal: (id) => {
        const completedAt = new Date().toISOString();
        const goal = get().goals.find((g) => g.id === id);
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, status: 'completed', completedAt } : g
          ),
          celebrationGoalId: id,
        }));
        track('Goal Completed', { category: goal?.category, priority: goal?.priority });
        const { user } = get();
        if (user) dbUpdateGoal(id, { status: 'completed', completedAt }).catch(console.error);
      },

      reopenGoal: (id) => {
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, status: 'active', completedAt: undefined } : g
          ),
        }));
        const { user } = get();
        if (user) dbUpdateGoal(id, { status: 'active', completedAt: undefined }).catch(console.error);
      },

      // ── Milestones ────────────────────────────────────────────────────────

      addMilestone: (goalId, milestone) => {
        const newMilestone: Milestone = { ...milestone, id: uid(), completed: false };
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId ? { ...g, milestones: [...g.milestones, newMilestone] } : g
          ),
        }));
        const goal = get().goals.find((g) => g.id === goalId);
        const { user } = get();
        if (user && goal) dbUpdateGoal(goalId, { milestones: goal.milestones }).catch(console.error);
      },

      toggleMilestone: (goalId, milestoneId) => {
        const before = get().goals.find((g) => g.id === goalId)?.milestones.find((m) => m.id === milestoneId);
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  milestones: g.milestones.map((m) =>
                    m.id === milestoneId
                      ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined }
                      : m
                  ),
                }
              : g
          ),
        }));
        if (!before?.completed) track('Milestone Completed');
        const goal = get().goals.find((g) => g.id === goalId);
        const { user } = get();
        if (user && goal) dbUpdateGoal(goalId, { milestones: goal.milestones }).catch(console.error);
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
        const { user } = get();
        if (user && goal) dbUpdateGoal(goalId, { milestones: goal.milestones }).catch(console.error);
      },

      // ── Experiences ───────────────────────────────────────────────────────

      addExperience: (exp) => {
        const newExp: Experience = {
          ...exp,
          id: uid(),
          status: 'want',
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ experiences: [newExp, ...s.experiences] }));
        track('Experience Added', { type: exp.type });
        const { user } = get();
        if (user) dbInsertExperience(newExp, user.id).catch(console.error);
      },

      updateExperience: (id, patch) => {
        set((s) => ({
          experiences: s.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }));
        const { user } = get();
        if (user) dbUpdateExperience(id, patch).catch(console.error);
      },

      deleteExperience: (id) => {
        set((s) => ({ experiences: s.experiences.filter((e) => e.id !== id) }));
        const { user } = get();
        if (user) dbDeleteExperience(id).catch(console.error);
      },

      markExperienceDone: (id, rating, review) => {
        const completedAt = new Date().toISOString();
        const exp = get().experiences.find((e) => e.id === id);
        set((s) => ({
          experiences: s.experiences.map((e) =>
            e.id === id ? { ...e, status: 'done', completedAt, rating, review } : e
          ),
        }));
        track('Experience Marked Done', { type: exp?.type, rating });
        const { user } = get();
        if (user) dbUpdateExperience(id, { status: 'done', completedAt, rating, review }).catch(console.error);
      },

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

export const useActiveGoals = () => useStore(useShallow((s) => s.goals.filter((g) => g.status === 'active')));
export const useCompletedGoals = () => useStore(useShallow((s) => s.goals.filter((g) => g.status === 'completed')));
export const useWantExperiences = () => useStore(useShallow((s) => s.experiences.filter((e) => e.status === 'want')));
export const useDoneExperiences = () => useStore(useShallow((s) => s.experiences.filter((e) => e.status === 'done')));
