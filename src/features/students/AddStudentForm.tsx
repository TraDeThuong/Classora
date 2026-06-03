import { useState } from "react";
import { useSearchStudentsByEmail } from "./useSearchStudentsByEmail";
import { useAddStudentToClass } from "./useAddStudentToClass";

interface AddStudentFormProps {
  classId: number;
  onCloseModal?: () => void;
}

export default function AddStudentForm({
  classId,
  onCloseModal,
}: AddStudentFormProps) {
  const [email, setEmail] = useState("");

  const { students, isLoading } = useSearchStudentsByEmail(email, classId);
  const { addStudent, isPending } = useAddStudentToClass(classId);

  function handleAddStudent(studentId: number) {
    addStudent(
      {
        classId,
        studentId,
      },
      {
        onSuccess: () => {
          onCloseModal?.();
        },
      },
    );
  }

  return (
    <div className="w-full pr-8 text-white">
      <h2 className="text-3xl font-bold leading-tight text-white">
        Add student to class
      </h2>

      <p className="mt-1.5 text-xl leading-relaxed text-white/60">
        Search existing student by email, then add them to this class.
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter student email..."
        className="
          mt-5 w-full rounded-xl border border-white/20
          bg-white/10 px-4 py-3 text-xl text-white
          outline-none placeholder:text-white/40
          focus:border-brand-200 focus:ring-2 focus:ring-brand-200/30
        "
      />

      <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
        {isLoading && (
          <p className="text-xl text-white/60">
            Searching students...
          </p>
        )}

        {!isLoading && email.length >= 2 && students.length === 0 && (
          <p className="text-xl text-white/60">
            No student found with this email.
          </p>
        )}

        {students.map((student) => (
          <div
            key={student.id}
            className="
              flex flex-col gap-3 rounded-xl border border-white/10
              bg-white/10 p-3 sm:flex-row sm:items-center sm:justify-between
            "
          >
            <div className="min-w-0">
              <p className="truncate text-2xl font-semibold text-white">
                {student.full_name}
              </p>

              <p className="truncate text-xl text-white/50">
                {student.email}
              </p>
            </div>

            <button
              type="button"
              disabled={isPending}
              onClick={() => handleAddStudent(student.id)}
              className="
                rounded-lg bg-brand-200 px-3 py-2
                text-xs font-semibold text-white
                transition hover:bg-brand-300
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              {isPending ? "Adding..." : "Add"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
