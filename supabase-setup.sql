-- FieldNotes (workout app) tables
-- Run this in the same Supabase project as phtracker (pqvheypxqjufdspkvzpk.supabase.co)
-- All tables use `workout_` prefix to avoid conflicts with phtracker's `habit_` tables.

-- Users (created via auth.users trigger)
create table if not exists public.workout_users (
  id uuid references auth.users primary key,
  email text,
  created_at timestamp with time zone default now()
);

-- Exercises
create table if not exists public.workout_exercises (
  id text primary key,
  user_id uuid references public.workout_users(id) on delete cascade,
  name text not null,
  cat text not null,
  muscle text not null,
  sets int default 3,
  reps int default 10,
  note text
);

-- Programs (days stored as JSON)
create table if not exists public.workout_programs (
  id text primary key,
  user_id uuid references public.workout_users(id) on delete cascade,
  name text not null,
  description text,
  days jsonb default '[]'::jsonb
);

-- Session logs
create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.workout_users(id) on delete cascade,
  date text not null,
  program_id text,
  day_label text,
  focus text,
  ex_count int
);

-- Goals
create table if not exists public.workout_goals (
  user_id uuid references public.workout_users(id) on delete cascade primary key,
  target_weight text default '',
  weekly_target int default 5,
  notes text default '',
  start_date text default ''
);

-- Notes
create table if not exists public.workout_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.workout_users(id) on delete cascade,
  title text default '',
  body text not null
);

-- Foods
create table if not exists public.workout_foods (
  id text primary key,
  name text not null,
  category text not null,
  kcal numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fat numeric not null,
  serving_size text,
  plant_based boolean default true
);

-- Meal logs
create table if not exists public.workout_meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.workout_users(id) on delete cascade,
  date text not null,
  meal_type text not null,
  food_ids text[] default '{}'
);

-- Nutrition goals
create table if not exists public.workout_nutrition_goals (
  user_id uuid references public.workout_users(id) on delete cascade primary key,
  kcal int default 1800,
  protein int default 90,
  carbs int default 200,
  fat int default 60
);

-- Meal plans
create table if not exists public.workout_meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.workout_users(id) on delete cascade,
  week_start text not null,
  plan jsonb default '{}'::jsonb
);

-- Auto-create user row on signup
create or replace function public.handle_new_workout_user()
returns trigger as $$
begin
  insert into public.workout_users (id, email)
  values (new.id, new.email);
  insert into public.workout_goals (user_id) values (new.id);
  insert into public.workout_nutrition_goals (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_workout_user_created on auth.users;
create trigger on_workout_user_created
  after insert on auth.users
  for each row execute function public.handle_new_workout_user();

-- RLS policies
alter table public.workout_users enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.workout_programs enable row level security;
alter table public.workout_logs enable row level security;
alter table public.workout_goals enable row level security;
alter table public.workout_notes enable row level security;
alter table public.workout_foods enable row level security;
alter table public.workout_meal_logs enable row level security;
alter table public.workout_nutrition_goals enable row level security;
alter table public.workout_meal_plans enable row level security;

-- Each user can only see their own data
create policy "users can read own data" on public.workout_users
  for select using (auth.uid() = id);

create policy "users can manage their exercises" on public.workout_exercises
  for all using (auth.uid() = user_id);

create policy "users can manage their programs" on public.workout_programs
  for all using (auth.uid() = user_id);

create policy "users can manage their logs" on public.workout_logs
  for all using (auth.uid() = user_id);

create policy "users can manage their goals" on public.workout_goals
  for all using (auth.uid() = user_id);

create policy "users can manage their notes" on public.workout_notes
  for all using (auth.uid() = user_id);

create policy "anyone can read foods" on public.workout_foods
  for select using (true);

create policy "users can manage their meal logs" on public.workout_meal_logs
  for all using (auth.uid() = user_id);

create policy "users can manage their nutrition goals" on public.workout_nutrition_goals
  for all using (auth.uid() = user_id);

create policy "users can manage their meal plans" on public.workout_meal_plans
  for all using (auth.uid() = user_id);
