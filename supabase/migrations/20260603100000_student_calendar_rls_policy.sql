-- Allow enrolled students to read schedules for their active classes.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'calendars'
      and policyname = 'calendars_select_for_enrolled_students'
  ) then
    create policy calendars_select_for_enrolled_students
      on public.calendars
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.class_students
          join public.students on students.id = class_students.student_id
          where class_students.class_id = calendars.class_id
            and class_students.status = 'active'
            and students.auth_user_id = auth.uid()
        )
      );
  end if;
end $$;
