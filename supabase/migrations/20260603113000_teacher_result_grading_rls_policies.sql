-- Allow teachers to read and grade submissions for assignments they own.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'results'
      and policyname = 'results_select_for_assignment_teachers'
  ) then
    create policy results_select_for_assignment_teachers
      on public.results
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.assignments
          join public.teachers on teachers.id = assignments.teacher_id
          where assignments.id = results.assignment_id
            and teachers.auth_user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'results'
      and policyname = 'results_update_for_assignment_teachers'
  ) then
    create policy results_update_for_assignment_teachers
      on public.results
      for update
      to authenticated
      using (
        exists (
          select 1
          from public.assignments
          join public.teachers on teachers.id = assignments.teacher_id
          where assignments.id = results.assignment_id
            and teachers.auth_user_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1
          from public.assignments
          join public.teachers on teachers.id = assignments.teacher_id
          where assignments.id = results.assignment_id
            and teachers.auth_user_id = auth.uid()
        )
      );
  end if;
end $$;
