# Classora - Teacher & Student Portal

Classora là ứng dụng web quản lý lớp học dành cho giáo viên và học sinh. Ứng dụng hỗ trợ giáo viên quản lý lớp, học sinh, lịch học, bài tập và kết quả nộp bài; học sinh có thể tham gia lớp bằng mã lớp, xem lịch học, làm bài tập, nộp câu trả lời và xem điểm/feedback.

Production URL: https://classora-teacher.vercel.app

## Mục Lục

- [Hướng dẫn chạy dự án](#huong-dan-chay-du-an)
- [Tổng quan](#tong-quan)
- [Tính năng chính](#tinh-nang-chinh)
- [Công nghệ sử dụng](#cong-nghe-su-dung)
- [Cấu trúc dự án](#cau-truc-du-an)
- [Routes](#routes)
- [Luồng nghiệp vụ](#luong-nghiep-vu)
- [Supabase và dữ liệu](#supabase-va-du-lieu)
- [Cài đặt local](#cai-dat-local)
- [Scripts](#scripts)
- [Kiểm thử thủ công](#kiem-thu-thu-cong)
- [Deploy](#deploy)
- [Troubleshooting](#troubleshooting)

## Hướng Dẫn Chạy Dự Án

### 1. Cài dependencies

```bash
npm install
```

### 2. Tạo file môi trường

Tạo file `.env.local` ở thư mục root:

```bash
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<public-anon-key>
```

### 3. Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại:

```text
http://localhost:5173
```

### 4. Build production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

Lưu ý: để dùng đầy đủ tính năng auth, database, upload ảnh, join class và nộp bài, Supabase project cần được cấu hình đúng theo phần [Supabase và dữ liệu](#supabase-va-du-lieu).

## Tổng Quan

Classora là một Single Page Application được xây dựng bằng React, TypeScript và Vite. Backend hiện dùng Supabase cho:

- Authentication bằng email/password và Google OAuth.
- Postgres database cho teachers, students, classes, assignments, results, calendars.
- Row Level Security để tách quyền giữa giáo viên và học sinh.
- Storage bucket `thumbnails` để upload ảnh lớp học.

Ứng dụng có 2 portal chính:

- Teacher portal: quản lý lớp học, học sinh, lịch, bài tập, chấm điểm.
- Student portal: tham gia lớp, xem lịch, xem bài tập, nộp bài, xem kết quả.

## Tính Năng Chính

### Authentication

- Đăng ký/đăng nhập giáo viên bằng email/password.
- Đăng ký/đăng nhập giáo viên bằng Google OAuth.
- Đăng ký/đăng nhập học sinh bằng email/password.
- Đăng ký/đăng nhập học sinh bằng Google OAuth.
- Tách tài khoản teacher và student. Tài khoản teacher không được đăng nhập vào student portal.
- Protected routes riêng cho teacher và student.
- Legacy redirects từ route cũ về route mới, ví dụ `/login` về `/teacher/login`.

### Teacher Portal

- Dashboard tổng quan.
- Analytics page.
- Quản lý classes:
  - Tạo lớp mới.
  - Upload thumbnail lên Supabase Storage.
  - Sinh `class_code` tự động.
  - Xem danh sách lớp.
  - Xem chi tiết lớp.
  - Cập nhật thông tin lớp.
  - Cập nhật trạng thái lớp.
  - Tự tính trạng thái lớp theo ngày bắt đầu/kết thúc.
- Quản lý students:
  - Tìm học sinh theo email.
  - Thêm học sinh vào lớp.
  - Xóa học sinh khỏi lớp.
  - Xem danh sách học sinh theo giáo viên.
  - Xem học sinh đang thuộc những lớp nào.
- Quản lý assignments:
  - Tạo assignment dạng `mcq`, `essay`, hoặc `mixed`.
  - Lưu questions dạng JSON.
  - Draft, publish, archive.
  - Không publish assignment đã archive.
  - Không publish assignment đã quá hạn.
  - Xem assignment theo lớp.
  - Xem chi tiết assignment.
  - Cập nhật assignment.
  - Xóa assignment.
- Results và grading:
  - Xem toàn bộ học sinh của lớp trong màn assignment results.
  - Hiển thị cả học sinh chưa nộp bằng virtual rows.
  - Tính trạng thái `pending`, `late`, `missing`, `graded`.
  - Chấm điểm, lưu score và feedback.
  - Xem answers của học sinh.
- Lịch học:
  - Tạo schedule theo lớp.
  - Xem schedule theo ngày.
  - Xóa schedule.
  - Cập nhật trạng thái `scheduled`, `completed`, `cancelled`.
- Profile:
  - Xem/cập nhật thông tin giáo viên.

### Student Portal

- Dashboard học sinh.
- Tham gia lớp bằng `class_code`.
- Xem danh sách lớp đã tham gia.
- Xem chi tiết lớp.
- Xem lịch học từ các lớp đang active.
- Xem assignment đã publish từ các lớp đã tham gia.
- Xem chi tiết assignment.
- Nộp bài:
  - MCQ answers.
  - Essay answers.
  - Mixed answers.
  - Không nộp nếu bài quá hạn và `allow_late_submit` là `false`.
  - Nộp trễ sẽ có status `late`.
  - Không cho nộp lại assignment đã được chấm `graded`.
- Xem results, score và feedback.
- Cập nhật profile học sinh.

## Công Nghệ Sử Dụng

- React 19
- TypeScript
- Vite
- React Router DOM
- TanStack Query
- Supabase JavaScript SDK
- Tailwind CSS
- React Hook Form
- React Hot Toast
- React Error Boundary
- React Icons
- Nano ID
- Plus Jakarta Sans font

## Cấu Trúc Dự Án

```text
.
├── public/                       # Static assets
├── src/
│   ├── App.tsx                   # Router, protected routes, providers
│   ├── main.tsx                  # React entrypoint
│   ├── index.css                 # Tailwind import và global styles
│   ├── assets/                   # Local images
│   ├── components/               # Shared UI components
│   ├── features/                 # Feature modules + hooks
│   │   ├── assignments/
│   │   ├── authentication/
│   │   ├── classes/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── results/
│   │   ├── schedules/
│   │   ├── student/
│   │   └── students/
│   ├── hooks/                    # Shared hooks
│   ├── pages/
│   │   ├── student/              # Student route pages
│   │   └── teacher/              # Teacher route pages
│   ├── services/                 # Supabase API layer
│   ├── types/                    # TypeScript domain types
│   └── utils/                    # Domain helpers
├── supabase/
│   └── migrations/               # SQL migrations for student workflow/RLS
├── package.json
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
└── vercel.json
```

### Các nhóm file quan trọng

- `src/App.tsx`: khai báo tất cả route, protected layout, redirect route cũ.
- `src/services/supabase.ts`: tạo Supabase client từ biến môi trường.
- `src/services/apiAuth.ts`: auth teacher/student, Google OAuth, current user/profile.
- `src/services/apiClasses.ts`: CRUD lớp học và upload thumbnail.
- `src/services/apiAssignments.ts`: CRUD assignment và publish/archive workflow.
- `src/services/apiStudentPortal.ts`: student classes, assignments, schedules, submissions, profile.
- `src/services/apiResults.ts`: teacher results và grading.
- `src/services/apiCalendars.ts`: teacher schedule.
- `src/services/apiStudents.ts`: student search/list cho teacher.
- `src/services/apiClassStudents.ts`: thêm/xóa học sinh khỏi lớp.
- `src/types/*.ts`: domain types cho classes, students, assignments, results, schedules.

## Routes

### Public Routes

| Route | Mô tả |
| --- | --- |
| `/` | Chọn vai trò teacher/student |
| `/teacher/login` | Teacher login |
| `/teacher/signup` | Teacher signup |
| `/teacher/complete-signup` | Hoàn tất Google signup cho teacher |
| `/teacher/auth/callback` | Google OAuth callback cho teacher |
| `/student/login` | Student login |
| `/student/signup` | Student signup |
| `/student/auth/callback` | Google OAuth callback cho student |
| `*` | Page not found |

### Teacher Protected Routes

Các route này được bọc bởi `ProtectRoute` và `AppLayout`.

| Route | Mô tả |
| --- | --- |
| `/teacher/dashboard` | Dashboard giáo viên |
| `/teacher/analytics` | Analytics |
| `/teacher/account` | Account |
| `/teacher/classes` | Danh sách lớp |
| `/teacher/classes/:classId` | Chi tiết lớp |
| `/teacher/students` | Danh sách học sinh của giáo viên |
| `/teacher/assignments` | Danh sách assignments |
| `/teacher/assignments/:assignmentId` | Chi tiết assignment và results |
| `/teacher/profile` | Profile giáo viên |

### Student Protected Routes

Các route này được bọc bởi `ProtectStudentRoute` và `StudentLayout`.

| Route | Mô tả |
| --- | --- |
| `/student` | Redirect về `/student/dashboard` |
| `/student/dashboard` | Dashboard học sinh |
| `/student/classes` | Lớp đã tham gia và form join class |
| `/student/classes/:classId` | Chi tiết lớp |
| `/student/schedules` | Lịch học |
| `/student/assignments` | Danh sách assignment đã publish |
| `/student/assignments/:assignmentId` | Làm bài/xem bài |
| `/student/results` | Kết quả và feedback |
| `/student/profile` | Profile học sinh |

### Legacy Redirects

Các route cũ như `/login`, `/signup`, `/dashboard`, `/classes`, `/assignments` được redirect về route teacher tương ứng để giữ tương thích sau khi tách teacher/student portal.

## Luồng Nghiệp Vụ

### Teacher signup bằng email/password

1. Teacher nhập full name, email, password.
2. `apiAuth.signUpTeacher` gọi `supabase.auth.signUp`.
3. Sau khi user được tạo, app insert profile vào bảng `teachers`.
4. Teacher dùng protected routes sau khi đăng nhập.

### Teacher signup bằng Google

1. App gọi Google OAuth với redirect `/teacher/complete-signup`.
2. Teacher đặt password nếu cần.
3. App upsert profile vào bảng `teachers` theo `auth_user_id`.

### Student signup/login

1. Student đăng ký bằng email/password hoặc Google OAuth.
2. App tạo hoặc liên kết profile trong bảng `students`.
3. Email được normalize về lowercase.
4. Nếu email đã có student record nhưng chưa có `auth_user_id`, app cập nhật record đó.
5. Nếu current user là teacher, app không cho đăng nhập vào student portal.

### Class workflow

1. Teacher tạo lớp với tên lớp, ngày bắt đầu/kết thúc, room, max students và thumbnail.
2. Thumbnail được upload vào Supabase Storage bucket `thumbnails`.
3. App tạo class với `teacher_id`, `class_code`, `thumbnail`.
4. `getClasses` tự tính lại status lớp bằng `getClassStatus`.
5. Student có thể join lớp bằng `class_code` nếu lớp không bị archive.

### Assignment workflow

1. Teacher tạo assignment cho một class.
2. Assignment có type `mcq`, `essay`, hoặc `mixed`.
3. Questions lưu trong cột JSON `questions`.
4. Assignment có thể ở trạng thái `draft`, `published`, `archived`.
5. Student chỉ nhìn thấy assignment có status `published` trong lớp đã join active.
6. Student nộp answers vào bảng `results`.
7. Nếu nộp sau due date, status là `late`; nếu đúng hạn, status là `pending`.
8. Teacher chấm điểm, lưu score/feedback và chuyển result sang `graded`.

### Results workflow

Teacher view assignment detail sẽ thấy:

- Học sinh đã nộp bài.
- Học sinh chưa nộp bài.
- Học sinh quá hạn chưa nộp (`missing`).
- Học sinh nộp trễ (`late`).
- Học sinh đã chấm (`graded`).

Các row chưa có record thật trong `results` được app tạo dưới dạng virtual row để UI vẫn hiển thị đủ roster của lớp.

## Supabase Và Dữ Liệu

### Environment variables

Tạo file `.env` hoặc `.env.local` ở root:

```bash
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<public-anon-key>
```

Supabase client nằm tại `src/services/supabase.ts`.

### Auth providers

Trong Supabase Dashboard:

1. Bật Email authentication.
2. Bật Google OAuth nếu dùng đăng nhập Google.
3. Thêm redirect URLs phù hợp:

```text
http://localhost:5173/teacher/auth/callback
http://localhost:5173/teacher/complete-signup
http://localhost:5173/student/auth/callback
https://classora-teacher.vercel.app/teacher/auth/callback
https://classora-teacher.vercel.app/teacher/complete-signup
https://classora-teacher.vercel.app/student/auth/callback
```

### Storage

Tạo bucket:

```text
thumbnails
```

Bucket này dùng để lưu ảnh thumbnail của lớp học. Code đang tạo public URL theo format:

```text
<VITE_SUPABASE_URL>/storage/v1/object/public/thumbnails/<file-name>
```

Vì vậy bucket cần có public read policy hoặc cấu hình public nếu muốn ảnh hiển thị trực tiếp.

### Bảng dữ liệu tối thiểu

Frontend hiện kỳ vọng các bảng sau:

| Table | Mục đích |
| --- | --- |
| `teachers` | Profile giáo viên, liên kết với `auth.users` qua `auth_user_id` |
| `students` | Profile học sinh, liên kết với `auth.users` qua `auth_user_id` |
| `classes` | Thông tin lớp học, mã lớp, teacher owner, ngày học, thumbnail |
| `class_students` | Bảng join giữa classes và students |
| `assignments` | Bài tập, câu hỏi JSON, trạng thái publish/draft/archive |
| `results` | Bài nộp, answers JSON, điểm, feedback, trạng thái |
| `calendars` | Lịch học theo lớp và teacher |

### Fields chính theo code

#### `teachers`

- `id`
- `auth_user_id`
- `full_name`
- `email`
- `avatar_url`
- `google_id`
- `status`

#### `students`

- `id`
- `created_at`
- `auth_user_id`
- `full_name`
- `email`
- `avatar_url`
- `google_id`
- `date_of_birth`
- `status`

Student status dùng trong app:

```text
active | inactive | graduated | banned
```

#### `classes`

- `id`
- `created_at`
- `teacher_id`
- `class_name`
- `class_code`
- `description`
- `max_students`
- `room`
- `thumbnail`
- `start_date`
- `end_date`
- `status`

Class status:

```text
active | inactive | completed | archived
```

#### `class_students`

- `id`
- `created_at`
- `class_id`
- `student_id`
- `status`

#### `assignments`

- `id`
- `created_at`
- `class_id`
- `teacher_id`
- `title`
- `description`
- `type`
- `total_score`
- `due_date`
- `allow_late_submit`
- `published_at`
- `status`
- `questions`

Assignment type:

```text
mcq | essay | mixed
```

Assignment status:

```text
draft | published | archived
```

Question shape:

```ts
{
  id: string;
  order: number;
  type: "mcq" | "essay";
  questionText: string;
  points: number;
  options?: string[];
  correctAnswer?: number;
}
```

#### `results`

- `id`
- `created_at`
- `assignment_id`
- `student_id`
- `score`
- `feedback`
- `submitted_at`
- `status`
- `answers`

Result status:

```text
pending | late | missing | graded
```

Answer shape:

```ts
{
  questionId: string;
  type: "mcq" | "essay";
  selectedOption?: number;
  text?: string;
  score?: number;
}
```

#### `calendars`

- `id`
- `created_at`
- `teacher_id`
- `class_id`
- `title`
- `note`
- `teaching_date`
- `start_time`
- `end_time`
- `location`
- `status`

Schedule status:

```text
scheduled | completed | cancelled
```

### Migrations

Các migration hiện có:

```text
supabase/migrations/20260602113000_add_student_workflow_columns.sql
supabase/migrations/20260602115000_fix_students_auth_user_id_unique_constraint.sql
supabase/migrations/20260602120000_student_workflow_rls_policies.sql
supabase/migrations/20260603100000_student_calendar_rls_policy.sql
supabase/migrations/20260603103000_student_class_teacher_rls_policies.sql
supabase/migrations/20260603110000_fix_results_nullable_submission_fields.sql
supabase/migrations/20260603113000_teacher_result_grading_rls_policies.sql
supabase/migrations/20260603120000_add_class_students_created_at.sql
```

Chạy theo đúng thứ tự trên trong Supabase SQL Editor hoặc bằng Supabase CLI nếu project đã link.

Các migration này bổ sung:

- `students.auth_user_id`
- `results.answers`
- unique constraint cho `students.auth_user_id`
- unique index `results(assignment_id, student_id)`
- nullable grading fields cho `results`
- `class_students.created_at`
- RLS policies cho student portal
- RLS policies cho teacher grading
- Policy cho student đọc schedules/classes/teacher names

### Ràng buộc quan trọng

- `students.auth_user_id` nên unique để upsert/link profile ổn định.
- `results(assignment_id, student_id)` cần unique để student submit bằng `upsert`.
- `results.score`, `results.feedback`, `results.submitted_at` phải cho phép `null` trước khi teacher chấm.
- `results.answers` nên có default `[]::jsonb`.

## Cài Đặt Local

### Yêu cầu

- Node.js 18+.
- npm.
- Supabase project đã cấu hình Auth, Database, RLS và Storage.

### Cài dependency

```bash
npm install
```

### Tạo biến môi trường

```bash
cp .env.example .env.local
```

Nếu không có `.env.example`, tự tạo `.env.local`:

```bash
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<public-anon-key>
```

### Chạy dev server

```bash
npm run dev
```

Vite mặc định chạy tại:

```text
http://localhost:5173
```

### Build production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Scripts

| Script | Mô tả |
| --- | --- |
| `npm run dev` | Chạy Vite dev server |
| `npm run build` | Chạy TypeScript build và Vite production build |
| `npm run preview` | Preview thư mục `dist` |
| `npm run lint` | Chạy ESLint |

## Kiểm Thử Thủ Công

### Smoke test

```bash
npm run build
npm run lint
```

### Teacher flow

- Truy cập `/teacher/signup`.
- Đăng ký teacher bằng email/password.
- Đăng nhập `/teacher/login`.
- Tạo class mới có thumbnail.
- Kiểm tra class xuất hiện ở `/teacher/classes`.
- Mở class detail.
- Tìm student bằng email và thêm vào class.
- Tạo assignment dạng MCQ.
- Publish assignment.
- Mở assignment detail và kiểm tra danh sách result rows.
- Chấm một submission, nhập score và feedback.
- Tạo schedule cho class.
- Đổi schedule status.

### Student flow

- Truy cập `/student/signup`.
- Đăng ký student.
- Đăng nhập `/student/login`.
- Join class bằng `class_code`.
- Kiểm tra class xuất hiện ở `/student/classes`.
- Kiểm tra schedule ở `/student/schedules`.
- Mở `/student/assignments`.
- Làm bài và submit.
- Mở `/student/results` để xem trạng thái.
- Sau khi teacher chấm, kiểm tra score và feedback.

### OAuth flow

- Bật Google provider trong Supabase.
- Cấu hình redirect URLs.
- Test teacher Google login/signup.
- Test student Google login/signup.
- Xác nhận teacher account không đăng nhập được student portal.

## Deploy

### Vercel

Thiết lập project:

- Framework preset: Vite.
- Build command: `npm run build`.
- Output directory: `dist`.
- Install command: `npm install`.

Environment variables trên Vercel:

```bash
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<public-anon-key>
```

Vì app dùng React Router client-side routes, `vercel.json` cần rewrite mọi route về `index.html`.

### Supabase production checklist

- Auth email enabled.
- Google provider enabled nếu dùng OAuth.
- Redirect URLs production đã thêm.
- Database tables đầy đủ.
- RLS enabled và policies đúng.
- Bucket `thumbnails` tồn tại.
- Public read policy cho thumbnails nếu dùng public image URLs.

## Troubleshooting

### `Supabase URL/Anon key is missing`

Kiểm tra `.env.local` có:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Sau khi sửa env, restart dev server.

### Google OAuth redirect sai

Kiểm tra redirect URLs trong Supabase Dashboard. Route teacher và student dùng callback khác nhau:

```text
/teacher/auth/callback
/teacher/complete-signup
/student/auth/callback
```

### Student không join được class

Kiểm tra:

- `class_code` đúng và được normalize uppercase.
- Class không ở status `archived`.
- Student chưa join class đó.
- RLS policy cho `classes` và `class_students` đã chạy.

### Student không thấy assignment

Kiểm tra:

- Assignment status là `published`.
- Student đã join class với status `active`.
- RLS policy `assignments_select_published_for_enrolled_students` đã chạy.

### Student submit bị lỗi conflict

Kiểm tra unique index:

```sql
create unique index if not exists results_assignment_student_unique
  on public.results (assignment_id, student_id);
```

### Teacher không thấy results

Kiểm tra:

- Assignment thuộc teacher hiện tại.
- Teacher profile có `auth_user_id` đúng.
- RLS policies `results_select_for_assignment_teachers` và `results_update_for_assignment_teachers` đã chạy.

### Thumbnail không hiển thị

Kiểm tra:

- Bucket `thumbnails` tồn tại.
- Upload không bị lỗi.
- Bucket/policy cho phép public read.
- URL trong DB đúng format public Supabase Storage URL.

### Build báo warning chunk lớn

Vite có thể báo một số chunk lớn hơn 500 kB sau minify. Đây là warning, không phải lỗi build. Có thể xử lý sau bằng dynamic import/code splitting nếu cần tối ưu performance.

## Ghi Chú Phát Triển

- Ưu tiên thêm logic gọi Supabase trong `src/services`.
- Hooks dùng TanStack Query đặt trong `src/features/<domain>`.
- Types domain đặt trong `src/types`.
- UI shared component đặt trong `src/components`.
- Teacher routes nằm trong `src/pages/teacher`.
- Student routes nằm trong `src/pages/student`.
- Khi thêm bảng/cột mới, nên thêm migration SQL vào `supabase/migrations`.
- Khi thêm protected route mới, cập nhật `src/App.tsx` và route guard phù hợp.
