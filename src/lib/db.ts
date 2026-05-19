/**
 * Supabase database helpers — thin wrappers over the REST API.
 * All functions are fire-and-forget from the store's perspective;
 * the Zustand store updates optimistically and these sync in background.
 */
import { supabase } from './supabase';
import type { Goal, Experience } from '../types';

// ─── Goals ──────────────────────────────────────────────────────────────────

export async function fetchGoals(userId: string): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) { console.error('[db] fetchGoals', error); return []; }

  return (data ?? []).map(row => ({
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    category: row.category,
    customCategoryName: row.custom_category_name ?? undefined,
    priority: row.priority,
    targetDate: row.target_date ?? undefined,
    milestones: row.milestones ?? [],
    status: row.status,
    createdAt: row.created_at,
    completedAt: row.completed_at ?? undefined,
    notes: row.notes ?? undefined,
    imageUrl: row.image_url ?? undefined,
  }));
}

export async function upsertGoal(userId: string, goal: Goal) {
  const { error } = await supabase.from('goals').upsert({
    id: goal.id,
    user_id: userId,
    title: goal.title,
    description: goal.description ?? null,
    category: goal.category,
    custom_category_name: goal.customCategoryName ?? null,
    priority: goal.priority,
    target_date: goal.targetDate ?? null,
    milestones: goal.milestones,
    status: goal.status,
    created_at: goal.createdAt,
    completed_at: goal.completedAt ?? null,
    notes: goal.notes ?? null,
    image_url: goal.imageUrl ?? null,
  });
  if (error) console.error('[db] upsertGoal', error);
}

export async function deleteGoal(id: string) {
  const { error } = await supabase.from('goals').delete().eq('id', id);
  if (error) console.error('[db] deleteGoal', error);
}

// ─── Experiences ─────────────────────────────────────────────────────────────

export async function fetchExperiences(userId: string): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) { console.error('[db] fetchExperiences', error); return []; }

  return (data ?? []).map(row => ({
    id: row.id,
    title: row.title,
    type: row.type,
    status: row.status,
    rating: row.rating ?? undefined,
    review: row.review ?? undefined,
    notes: row.notes ?? undefined,
    link: row.link ?? undefined,
    priceEstimate: row.price_estimate ?? undefined,
    createdAt: row.created_at,
    completedAt: row.completed_at ?? undefined,
  }));
}

export async function upsertExperience(userId: string, exp: Experience) {
  const { error } = await supabase.from('experiences').upsert({
    id: exp.id,
    user_id: userId,
    title: exp.title,
    type: exp.type,
    status: exp.status,
    rating: exp.rating ?? null,
    review: exp.review ?? null,
    notes: exp.notes ?? null,
    link: exp.link ?? null,
    price_estimate: exp.priceEstimate ?? null,
    created_at: exp.createdAt,
    completed_at: exp.completedAt ?? null,
  });
  if (error) console.error('[db] upsertExperience', error);
}

export async function deleteExperience(id: string) {
  const { error } = await supabase.from('experiences').delete().eq('id', id);
  if (error) console.error('[db] deleteExperience', error);
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, joined_at')
    .eq('id', userId)
    .single();
  if (error) console.error('[db] fetchProfile', error);
  return data;
}

export async function upsertProfile(userId: string, name: string, joinedAt: string) {
  const { error } = await supabase.from('profiles').upsert({
    id: userId,
    name,
    joined_at: joinedAt,
  });
  if (error) console.error('[db] upsertProfile', error);
}
