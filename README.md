# Classora LMS Mini

## Project Overview

Classora is a mini Learning Management System (LMS) project with two planned applications:

1. **Classora Teacher** — the instructor portal for teachers
2. **Classora Student** — the learner portal for students

This repository currently contains the teacher frontend application only. The student-facing portal is planned for a later development phase.

## Current Scope

- Teacher portal: **actively developed**
- Student portal: **planned but not included yet**
- Backend integration: Supabase is used for authentication and data storage

## Teacher Portal Features

The teacher portal is designed to support instructors with:

- class management (create, update, and view classes)
- student management within each class
- assignment creation, editing, publish/unpublish workflows
- assignment status tracking and progress views
- result tracking and grade reporting
- user authentication with email/password and Google OAuth

## Technology Stack

- React + TypeScript
- Vite
- Supabase (`@supabase/supabase-js`)
- TanStack Query
- Tailwind CSS
- React Router DOM
- React Hook Form

## Repository Layout

- `ClassoraTeachers/` — teacher portal source code and configuration
- `ClassoraStudents/` — placeholder for student portal source code

### Teacher portal structure

- `src/components/` — shared UI components
- `src/features/` — feature modules for authentication, classes, assignments, students, etc.
- `src/pages/` — route-level page views
- `src/services/` — API client and Supabase integration
- `src/utils/` — helper functions

## Setup and Local Development

1. Navigate to the teacher portal folder:

```bash
cd ClassoraTeachers
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with Supabase credentials:

```bash
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

4. Start the development server:

```bash
npm run dev
```

## Available Scripts

Inside `ClassoraTeachers/`:

- `npm run dev` — start the development server
- `npm run build` — build the production bundle
- `npm run preview` — preview the build locally
- `npm run lint` — run ESLint checks

## Notes and Roadmap

- The root `README.md` documents the overall LMS Mini project.
- The `ClassoraTeachers/` folder contains the live teacher portal frontend.
- The `ClassoraStudents/` folder is reserved for the future student portal.

### Future work

- implement Classora Student portal
- add more assignment grading analytics
- improve attendance and notification features
- build a shared backend schema for both portals

## Deployment

The teacher portal can be deployed from `ClassoraTeachers/` as a Vite application. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the target environment.

## Contact

If you want me to expand this README with architecture details, backend schema, or student portal planning, I can do that next.
