-- Student workflow schema support.
-- Run this in Supabase SQL Editor, or with Supabase CLI after linking the project.

alter table public.students
  add column if not exists auth_user_id uuid;

alter table public.results
  add column if not exists answers jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'students_auth_user_id_fkey'
      and conrelid = 'public.students'::regclass
  ) then
    alter table public.students
      add constraint students_auth_user_id_fkey
      foreign key (auth_user_id)
      references auth.users(id)
      on delete set null;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'students_auth_user_id_key'
      and conrelid = 'public.students'::regclass
  ) then
    alter table public.students
      add constraint students_auth_user_id_key
      unique (auth_user_id);
  end if;
end $$;

-- This protects against duplicate submissions for the same assignment/student.
-- If this fails, remove or merge duplicate rows in public.results first.
create unique index if not exists results_assignment_student_unique
  on public.results (assignment_id, student_id);
