-- Student submissions are created before teacher grading, so grading fields
-- must allow null values until the teacher saves a score and feedback.

alter table public.results
  alter column feedback drop not null,
  alter column score drop not null,
  alter column submitted_at drop not null;

alter table public.results
  alter column answers set default '[]'::jsonb;

create unique index if not exists results_assignment_student_unique
  on public.results (assignment_id, student_id);
