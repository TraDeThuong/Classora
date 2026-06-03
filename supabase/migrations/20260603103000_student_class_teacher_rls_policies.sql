-- Support student portal class lookup/join and teacher display names.
-- Students need to read joinable classes by class code before enrollment, and
-- enrolled class/assignment/schedule views need teacher names through relations.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'teachers'
      and policyname = 'teachers_select_own_profile'
  ) then
    create policy teachers_select_own_profile
      on public.teachers
      for select
      to authenticated
      using (auth_user_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'classes'
      and policyname = 'classes_select_joinable_or_enrolled_students'
  ) then
    create policy classes_select_joinable_or_enrolled_students
      on public.classes
      for select
      to authenticated
      using (
        status <> 'archived'
        or exists (
          select 1
          from public.class_students
          join public.students on students.id = class_students.student_id
          where class_students.class_id = classes.id
            and class_students.status = 'active'
            and students.auth_user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'teachers'
      and policyname = 'teachers_select_for_student_classes'
  ) then
    create policy teachers_select_for_student_classes
      on public.teachers
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.classes
          where classes.teacher_id = teachers.id
            and (
              classes.status <> 'archived'
              or exists (
                select 1
                from public.class_students
                join public.students on students.id = class_students.student_id
                where class_students.class_id = classes.id
                  and class_students.status = 'active'
                  and students.auth_user_id = auth.uid()
              )
            )
        )
      );
  end if;
end $$;
