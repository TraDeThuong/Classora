-- Minimal RLS policies for the student portal.
-- These policies are permissive additions. Existing teacher policies remain in effect.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'students'
      and policyname = 'students_select_own_profile'
  ) then
    create policy students_select_own_profile
      on public.students
      for select
      to authenticated
      using (
        auth_user_id = auth.uid()
        or (auth_user_id is null and email = (auth.jwt() ->> 'email'))
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'students'
      and policyname = 'students_insert_own_profile'
  ) then
    create policy students_insert_own_profile
      on public.students
      for insert
      to authenticated
      with check (auth_user_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'students'
      and policyname = 'students_update_own_profile'
  ) then
    create policy students_update_own_profile
      on public.students
      for update
      to authenticated
      using (
        auth_user_id = auth.uid()
        or (auth_user_id is null and email = (auth.jwt() ->> 'email'))
      )
      with check (auth_user_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'class_students'
      and policyname = 'class_students_select_own_enrollments'
  ) then
    create policy class_students_select_own_enrollments
      on public.class_students
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.students
          where students.id = class_students.student_id
            and students.auth_user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'class_students'
      and policyname = 'class_students_insert_own_enrollment'
  ) then
    create policy class_students_insert_own_enrollment
      on public.class_students
      for insert
      to authenticated
      with check (
        exists (
          select 1
          from public.students
          where students.id = class_students.student_id
            and students.auth_user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'assignments'
      and policyname = 'assignments_select_published_for_enrolled_students'
  ) then
    create policy assignments_select_published_for_enrolled_students
      on public.assignments
      for select
      to authenticated
      using (
        status = 'published'
        and exists (
          select 1
          from public.class_students
          join public.students on students.id = class_students.student_id
          where class_students.class_id = assignments.class_id
            and class_students.status = 'active'
            and students.auth_user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'results'
      and policyname = 'results_select_own_submissions'
  ) then
    create policy results_select_own_submissions
      on public.results
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.students
          where students.id = results.student_id
            and students.auth_user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'results'
      and policyname = 'results_insert_own_submissions'
  ) then
    create policy results_insert_own_submissions
      on public.results
      for insert
      to authenticated
      with check (
        exists (
          select 1
          from public.students
          where students.id = results.student_id
            and students.auth_user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'results'
      and policyname = 'results_update_own_ungraded_submissions'
  ) then
    create policy results_update_own_ungraded_submissions
      on public.results
      for update
      to authenticated
      using (
        status <> 'graded'
        and exists (
          select 1
          from public.students
          where students.id = results.student_id
            and students.auth_user_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1
          from public.students
          where students.id = results.student_id
            and students.auth_user_id = auth.uid()
        )
      );
  end if;
end $$;
