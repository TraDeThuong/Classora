-- Track when students join a class so teacher dashboards can show activity.

alter table public.class_students
  add column if not exists created_at timestamptz not null default now();
