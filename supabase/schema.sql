-- ═══════════════════════════════════════════════════════════════════
--  Lifemarks — Supabase Database Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════

-- ── Profiles ──────────────────────────────────────────────────────
create table if not exists public.profiles (
  id        uuid primary key references auth.users on delete cascade,
  name      text not null default '',
  joined_at timestamptz not null default now()
);

-- ── Goals ─────────────────────────────────────────────────────────
create table if not exists public.goals (
  id                   text primary key,
  user_id              uuid not null references auth.users on delete cascade,
  title                text not null,
  description          text,
  category             text not null,
  custom_category_name text,
  priority             text not null,
  target_date          text,
  milestones           jsonb not null default '[]'::jsonb,
  status               text not null default 'active',
  created_at           text not null,
  completed_at         text,
  notes                text,
  image_url            text
);

-- ── Experiences ───────────────────────────────────────────────────
create table if not exists public.experiences (
  id            text primary key,
  user_id       uuid not null references auth.users on delete cascade,
  title         text not null,
  type          text not null,
  status        text not null default 'want',
  rating        integer,
  review        text,
  notes         text,
  link          text,
  price_estimate text,
  created_at    text not null,
  completed_at  text
);

-- ── Row Level Security ────────────────────────────────────────────
alter table public.profiles    enable row level security;
alter table public.goals       enable row level security;
alter table public.experiences enable row level security;

-- Users can only read/write their own rows
create policy "profiles: own rows"    on public.profiles    for all using (auth.uid() = id);
create policy "goals: own rows"       on public.goals       for all using (auth.uid() = user_id);
create policy "experiences: own rows" on public.experiences for all using (auth.uid() = user_id);

-- ── Auto-create profile on signup ────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, joined_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop existing trigger if it exists, then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Indexes for performance ───────────────────────────────────────
create index if not exists goals_user_id_idx       on public.goals       (user_id);
create index if not exists experiences_user_id_idx on public.experiences (user_id);
