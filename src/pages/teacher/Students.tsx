import { useMemo, useState } from "react";
import Empty from "../../components/Empty";
import ErrorMessage from "../../components/ErrorMessage";
import FullPageLoader from "../../components/FullPageLoader";
import Table from "../../components/Table";
import { useStudentsByTeacher } from "../../features/students/StudentsByTeacher";
import type { StudentStatus, TeacherStudent } from "../../types/students";
import { getStudentAvatar } from "../../utils/getStudentAvatar";

const statusOptions: Array<{ value: "all" | StudentStatus; label: string }> = [
  { value: "all", label: "All status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "graduated", label: "Graduated" },
  { value: "banned", label: "Banned" },
];

const statusConfig: Record<
  StudentStatus,
  { label: string; className: string; dot: string }
> = {
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-400",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-500",
    dot: "bg-gray-400",
  },
  graduated: {
    label: "Graduated",
    className: "bg-blue-50 text-blue-700",
    dot: "bg-blue-400",
  },
  banned: {
    label: "Banned",
    className: "bg-red-50 text-red-600",
    dot: "bg-red-400",
  },
};

function formatDate(date: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("vi-VN");
}

function StudentStatusBadge({ status }: { status: StudentStatus }) {
  const config = statusConfig[status] ?? statusConfig.inactive;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full
        px-3 py-1 text-xs font-semibold sm:text-sm
        ${config.className}
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function StudentRow({ student }: { student: TeacherStudent }) {
  const avatar = getStudentAvatar(student.avatar_url, student.id);

  return (
    <Table.Row>
      <div>
        <img
          src={avatar}
          alt={student.full_name}
          className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
        />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-800 sm:text-base">
          {student.full_name}
        </p>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm text-gray-500 sm:text-base">
          {student.email}
        </p>
      </div>

      <div>
        <StudentStatusBadge status={student.status} />
      </div>

      <div className="text-sm font-semibold text-gray-700 sm:text-base">
        {student.class_count}
      </div>

      <div className="flex flex-wrap gap-2">
        {student.classes.map((classItem) => (
          <span
            key={classItem.id}
            className="
              rounded-full bg-brand-50 px-3 py-1
              text-xs font-semibold text-brand-300
              sm:text-sm
            "
          >
            {classItem.class_name} ({classItem.class_code})
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-500 sm:text-base">
        {formatDate(student.date_of_birth)}
      </div>
    </Table.Row>
  );
}

function matchesSearch(student: TeacherStudent, searchQuery: string) {
  const normalizedSearch = searchQuery.trim().toLowerCase();
  if (!normalizedSearch) return true;

  const searchableText = [
    student.full_name,
    student.email,
    ...student.classes.flatMap((classItem) => [
      classItem.class_name,
      classItem.class_code,
    ]),
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedSearch);
}

export default function Students() {
  const { students = [], error, isLoading } = useStudentsByTeacher();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StudentStatus>(
    "all",
  );

  const filteredStudents = useMemo(
    () =>
      students
        .filter((student) => matchesSearch(student, searchQuery))
        .filter((student) =>
          statusFilter === "all" ? true : student.status === statusFilter,
        )
        .sort((first, second) =>
          first.full_name.localeCompare(second.full_name),
        ),
    [searchQuery, statusFilter, students],
  );

  if (isLoading) return <FullPageLoader text="Loading students..." />;

  if (error) {
    return <ErrorMessage message="Students could not be loaded." />;
  }

  if (!students.length) {
    return <Empty resourceName="students" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-bold text-brand-300">Students</h1>
          <p className="mt-2 text-brand-300/70">
            {students.length} students across your classes.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(22rem,32rem)_16rem]">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search name, email, or class"
            className="
              w-full rounded-2xl border border-white/30 bg-white/70
              px-4 py-3 text-sm text-brand-300 shadow-sm
              outline-none transition
              placeholder:text-brand-300/40
              focus:border-brand-200 focus:bg-white
            "
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | StudentStatus)
            }
            className="
              w-full rounded-2xl border border-white/30 bg-white/70
              px-4 py-3 text-sm font-semibold text-brand-300 shadow-sm
              outline-none transition
              focus:border-brand-200 focus:bg-white
            "
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-3xl">
        <div className="min-w-[98rem]">
          <Table columns="0.5fr 1.7fr 2.1fr 1.1fr 0.8fr 2.6fr 1fr">
            <Table.Header>
              <div>Avatar</div>
              <div>Name</div>
              <div>Email</div>
              <div>Status</div>
              <div>Classes</div>
              <div>Class List</div>
              <div>Birthday</div>
            </Table.Header>

            <Table.Body
              data={filteredStudents}
              render={(student) => (
                <StudentRow key={student.id} student={student} />
              )}
            />
          </Table>
        </div>
      </div>
    </div>
  );
}
