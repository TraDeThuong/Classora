import { useState } from "react";
import { useSearchStudentsByEmail } from "./useSearchStudentsByEmail";
import { useAddStudentToClass } from "./useAddStudentToClass";

interface AddStudentFormProps {
  classId: number;
}

export default function AddStudentForm({ classId }: AddStudentFormProps) {
  const [email, setEmail] = useState("");

  const { students, isLoading } = useSearchStudentsByEmail(email, classId);
  const { addStudent, isPending } = useAddStudentToClass(classId);

  function handleAddStudent(studentId: number) {
    addStudent({
      classId,
      studentId,
    });
  }

  return (
    <div className="w-full max-w-xl rounded-3xl bg-white/10 p-6 backdrop-blur-xl">
      <h2 className="text-3xl font-bold text-white">
        Add student to class
      </h2>

      <p className="mt-2 text-sm text-white/60">
        Search existing student by email, then add them to this class.
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter student email..."
        className="
          mt-6 w-full rounded-2xl border border-white/20
          bg-white/10 px-5 py-4 text-white
          outline-none placeholder:text-white/40
          focus:border-brand-200 focus:ring-2 focus:ring-brand-200/30
        "
      />

      <div className="mt-5 space-y-3">
        {isLoading && (
          <p className="text-sm text-white/60">
            Searching students...
          </p>
        )}

        {!isLoading && email.length >= 2 && students.length === 0 && (
          <p className="text-sm text-white/60">
            No student found with this email.
          </p>
        )}

        {students.map((student) => (
          <div
            key={student.id}
            className="
              flex items-center justify-between gap-4
              rounded-2xl border border-white/10
              bg-white/10 p-4
            "
          >
            <div>
              <p className="font-semibold text-white">
                {student.full_name}
              </p>

              <p className="text-sm text-white/50">
                {student.email}
              </p>
            </div>

            <button
              type="button"
              disabled={isPending}
              onClick={() => handleAddStudent(student.id)}
              className="
                rounded-xl bg-brand-200 px-4 py-2
                text-sm font-semibold text-white
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