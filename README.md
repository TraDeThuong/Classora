# Classora — Teacher & Student Portal (ClassoraTeachers)
Link: https://classora-teacher.vercel.app

## Overview

Classora Teachers (ClassoraTeachers) is a single-page web application built for instructors and students. Teachers manage classes, assignments, students, schedules, submissions, and results. Students can join classes, complete assignments, submit answers, and review grades/feedback. It is implemented with modern frontend technologies and integrates with Supabase for authentication and persistence.

This repository contains the frontend application only.

## Key features

- User authentication (email/password + Google OAuth via Supabase)
- Class management: create, update, view classes and class details
- Student management: list, add, and manage students per class
- Assignment management: create, edit, publish/unpublish, and grade assignments
- Submission/results tracking: view pending, late, missing, and graded submissions per assignment
- Grading workflow: save score and feedback for submitted results, with MCQ score suggestion when answers are available
- Student portal at `/student/*`: student auth, class-code joining, assignment taking, submission, and results review
- File upload / download and basic document handling
- Client-side caching and background fetching using TanStack Query

## Technology stack

- React 19 + TypeScript
- Vite (build & dev server)
- Supabase (@supabase/supabase-js) for Auth and Postgres
- TanStack Query for server state management and caching
- Tailwind CSS for utility-first styling
- react-hook-form for form handling
- react-router-dom for routing

## Prerequisites

- Node.js 18+ (recommended)
- npm or pnpm
- A Supabase project (for Auth and database) if you want to run the app connected to a real backend

## Environment variables

Create a `.env` or `.env.local` file in the repository root with the following variables:

```bash
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```

These are consumed by `src/services/supabase.ts` to create the Supabase client.

## Local development

1. Install dependencies

```bash
npm install
```

2. Start development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Preview production build locally

```bash
npm run preview
```

## Available scripts

- `dev` — start Vite development server
- `build` — compile TypeScript and build a production bundle (runs `tsc -b && vite build`)
- `preview` — preview the production build locally
- `lint` — run ESLint across the codebase

## Project layout

Top-level structure (relevant paths):

- `src/`
  - `components/` — shared UI components (layout, forms, modals, table, etc.)
  - `features/` — feature modules organized by domain (assignments, authentication, classes, students, etc.)
  - `pages/` — route-level views used by the router
  - `services/` — API clients (e.g., `supabase.ts`) and integrations
  - `utils/` — utility functions and helpers

## Important files

- `src/main.tsx` — application entry point and global ErrorBoundary
- `src/App.tsx` — router and global providers (QueryClientProvider, Toaster)
- `src/services/supabase.ts` — Supabase client initialization using VITE\_\* env vars

## Supabase integration

The application uses Supabase for authentication and data storage. The client is initialized in `src/services/supabase.ts` as follows:

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default createClient(supabaseUrl, supabaseAnonKey);
```

For full functionality (signup, OAuth, database reads/writes) you need a Supabase project with the corresponding tables and RLS/policies configured.

### Minimum database tables

The frontend expects these Supabase tables/relations:

- `teachers`: teacher profile linked to `auth.users` through `auth_user_id`
- `classes`: class metadata, `teacher_id`, `class_code`, dates, status, and thumbnail URL
- `students`: student profile data linked to `auth.users` through nullable unique `auth_user_id`
- `class_students`: join table with `class_id`, `student_id`, and enrollment status
- `assignments`: assignment metadata plus a `questions` JSON column for MCQ/essay questions
- `results`: submission/grading rows with `assignment_id`, `student_id`, `score`, `feedback`, `submitted_at`, `status`, and optional `answers` JSON
- `calendars`: teaching schedule rows linked to teacher and class

The `results.status` values used by the UI are `pending`, `late`, `missing`, and `graded`. Missing and pending rows are computed from the class roster when no result row exists yet; grading updates an existing submitted row.

Recommended constraints:

- `students.auth_user_id` should be unique when present.
- `results(assignment_id, student_id)` should be unique if you want database-level protection against duplicate submissions.

The schema updates for the student workflow are provided in:

```bash
supabase/migrations/20260602113000_add_student_workflow_columns.sql
supabase/migrations/20260602115000_fix_students_auth_user_id_unique_constraint.sql
supabase/migrations/20260602120000_student_workflow_rls_policies.sql
```

Run them in this order in the Supabase SQL Editor before testing student signup/submission flows.

## Student portal routes

- `/student/login` — student email/password login and Google OAuth entry
- `/student/signup` — student email/password signup and Google OAuth entry
- `/student/auth/callback` — Google OAuth callback that creates/loads a student profile
- `/student/dashboard` — class and assignment summary
- `/student/classes` — joined classes and class-code join form
- `/student/assignments` — published assignments from joined classes
- `/student/assignments/:assignmentId` — assignment taking/review page
- `/student/results` — submitted assignments, grades, and feedback
- `/student/profile` — student profile display

## Authentication & OAuth

- OAuth providers (e.g., Google) must be enabled in the Supabase project settings.
- Redirect/callback route is handled at `/auth/callback` by `src/features/authentication/AuthCallback.tsx`.

## Data fetching & caching

The project uses TanStack Query to manage server state and background refreshes. Default query stale time is configured in `src/App.tsx`.

## Styling

Tailwind CSS utilities are used for layout and styling. See `index.css` for Tailwind directives and custom variables.

## Linting & formatting

- ESLint is configured and can be run with:

```bash
npm run lint
```

## Verification checklist

- `npm run lint`
- `npm run build`
- Auth: login, Google signup/callback, protected route redirect
- Classes: create class, view class detail, add/remove students, archive/restore completed classes
- Assignments: create MCQ/essay/mixed assignment, edit, publish/draft/archive, filter assignment table
- Results: open assignment detail, review submissions, filter status/student, grade submitted work, save feedback
- Student portal: signup/login, join class by code, view published assignments, submit MCQ/essay answers, review score/feedback

## Deployment

General recommendations:

- Build the app with `npm run build` and serve the `dist/` output.
- Vercel and Netlify both support Vite apps; set the build command to `npm run build` and the publish directory to `dist`.
- Make sure to configure the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables in your hosting provider's dashboard.

Example: Vercel

1. Connect repository to Vercel
2. Set Environment Variables in Project Settings
3. Build Command: `npm run build`
4. Output Directory: `dist`

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch
3. Open a pull request with a clear description and related issue (if any)

Please include tests or manual verification steps with larger changes.

## Troubleshooting

- If Supabase calls fail, verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly.
- If the dev server fails to start, delete `node_modules` and reinstall with `npm install`.

## Contact

If you need a deeper documentation set (API schema, database migration steps, deployment pipeline, or contributor guidelines), I can generate them—tell me which area to prioritize.

---

README updated: professional English documentation added.
