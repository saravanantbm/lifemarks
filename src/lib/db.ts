import { supabase } from './supabase';
import type { Goal, Experience } from '../types';

// ── Goals ──────────────────────────────────────────────────────────────────

export async function dbLoadGoals(userId: string): Promise<Goal[]> {
  const { data } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (!data) return [];
  return data.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    customCategoryName: r.custom_category_name,
    priority: r.priority,
    targetDate: r.target_date,
    milestones: r.milestones ?? [],
    status: r.status,
    createdAt: r.created_at,
    completedAt: r.completed_at,
    notes: r.notes,
    imageUrl: r.image_url,
  }));
}

export async function dbInsertGoal(goal: Goal, userId: string): Promise<void> {
  await supabase.from('goals').insert({
    id: goal.id,
    user_id: userId,
    title: goal.title,
    description: goal.description,
    category: goal.category,
    custom_category_name: goal.customCategoryName,
    priority: goal.priority,
    target_date: goal.targetDate,
    milestones: goal.milestones,
    status: goal.status,
    created_at: goal.createdAt,
    completed_at: goal.completedAt,
    notes: goal.notes,
    image_url: goal.imageUrl,
  });
}

export async function dbUpdateGoal(id: string, patch: Partial<Goal>): Promise<void> {
  const row: Record<string, unknown> = {};
  if ('title' in patch) row.title = patch.title;
  if ('description' in patch) row.description = patch.description;
  if ('category' in patch) row.category = patch.category;
  if ('customCategoryName' in patch) row.custom_category_name = patch.customCategoryName;
  if ('priority' in patch) row.priority = patch.priority;
  if ('targetDate' in patch) row.target_date = patch.targetDate;
  if ('milestones' in patch) row.milestones = patch.milestones;
  if ('status' in patch) row.status = patch.status;
  if ('completedAt' in patch) row.completed_at = patch.completedAt;
  if ('notes' in patch) row.notes = patch.notes;
  if ('imageUrl' in patch) row.image_url = patch.imageUrl;
  if (Object.keys(row).length === 0) return;
  await supabase.from('goals').update(row).eq('id', id);
}

export async function dbDeleteGoal(id: string): Promise<void> {
  await supabase.from('goals').delete().eq('id', id);
}

// ── Experiences ────────────────────────────────────────────────────────────

export async function dbLoadExperiences(userId: string): Promise<Experience[]> {
  const { data } = await supabase
    .from('experiences')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (!data) return [];
  return data.map((r) => ({
    id: r.id,
    title: r.title,
    type: r.type,
    status: r.status,
    rating: r.rating,
    review: r.review,
    notes: r.notes,
    link: r.link,
    priceEstimate: r.price_estimate,
    createdAt: r.created_at,
    completedAt: r.completed_at,
  }));
}

export async function dbInsertExperience(exp: Experience, userId: string): Promise<void> {
  await supabase.from('experiences').insert({
    id: exp.id,
    user_id: userId,
    title: exp.title,
    type: exp.type,
    status: exp.status,
    rating: exp.rating,
    review: exp.review,
    notes: exp.notes,
    link: exp.link,
    price_estimate: exp.priceEstimate,
    created_at: exp.createdAt,
    completed_at: exp.completedAt,
  });
}

export async function dbUpdateExperience(id: string, patch: Partial<Experience>): Promise<void> {
  const row: Record<string, unknown> = {};
  if ('title' in patch) row.title = patch.title;
  if ('type' in patch) row.type = patch.type;
  if ('status' in patch) row.status = patch.status;
  if ('rating' in patch) row.rating = patch.rating;
  if ('review' in patch) row.review = patch.review;
  if ('notes' in patch) row.notes = patch.notes;
  if ('link' in patch) row.link = patch.link;
  if ('priceEstimate' in patch) row.price_estimate = patch.priceEstimate;
  if ('completedAt' in patch) row.completed_at = patch.completedAt;
  if (Object.keys(row).length === 0) return;
  await supabase.from('experiences').update(row).eq('id', id);
}

export async function dbDeleteExperience(id: string): Promise<void> {
  await supabase.from('experiences').delete().eq('id', id);
}
