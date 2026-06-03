-- Fix student auth upsert support.
-- Use a real unique constraint so Supabase upsert(... onConflict: "auth_user_id")
-- can target students.auth_user_id reliably.

drop index if exists public.students_auth_user_id_unique;

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
