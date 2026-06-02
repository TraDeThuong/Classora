import Spinner from "../../components/Spinner";
import Empty from "../../components/Empty";
import { useAssignmentDetail } from "./useAssignmentDetail";

interface Question {
  id?: string;
  type: "mcq" | "essay";
  order?: number;
  points?: number;
  questionText: string;
  options?: string[];
  correctAnswer?: number;
}

interface AssignmentDetailProps {
  assignmentId: number;
}

export default function AssignmentDetail({
  assignmentId,
}: AssignmentDetailProps) {
  const { assignment, isLoading } = useAssignmentDetail(assignmentId);

  if (isLoading) return <Spinner />;
  if (!assignment) return <Empty resourceName="assignment" />;

  const { title, due_date, description, questions, teachers } = assignment;

  const dueDate = due_date
    ? new Date(due_date).toLocaleDateString("vi-VN")
    : "No due date";

  return (
    <div className="mx-auto flex max-h-[85vh] max-w-5xl flex-col gap-8 overflow-y-auto rounded-3xl border border-white/20 bg-white/40 p-8 shadow-xl backdrop-blur-xl scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      <div className="flex flex-col gap-3 border-b border-white/20 pb-6">
        <h1 className="text-4xl font-bold text-brand-300">{title}</h1>

        <div className="flex flex-wrap gap-4 text-lg text-brand-300/80">
          <p>
            <span className="font-semibold">Due date:</span> {dueDate}
          </p>

          <p>
            <span className="font-semibold">Teacher:</span>{" "}
            {teachers?.full_name || "Unknown teacher"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white/50 p-5">
        <h2 className="mb-3 text-2xl font-semibold text-brand-300">
          Description
        </h2>

        <p className="text-lg leading-relaxed text-brand-300/80">
          {description || "No description"}
        </p>
      </div>

      <div className="rounded-2xl bg-white/50 p-5">
        <h2 className="mb-5 text-2xl font-semibold text-brand-300">
          Questions
        </h2>

        {!questions?.length ? (
          <p className="text-brand-300/70">No questions found.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {questions.map((question: Question, index: number) => (
              <div
                key={question.id ?? index}
                className="rounded-2xl border border-white/30 bg-white/60 p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <p className="text-xl font-semibold text-brand-300">
                    {question.order ?? index + 1}. {question.questionText}
                  </p>

                  <span className="rounded-full bg-brand-300/10 px-3 py-1 text-sm font-semibold text-brand-300">
                    {question.points ?? 0} pts
                  </span>
                </div>

                {question.type === "mcq" && !!question.options?.length && (
                  <div className="flex flex-col gap-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center gap-3 rounded-xl bg-white/50 px-4 py-3 text-brand-300"
                      >
                        <input
                          type="radio"
                          disabled
                          checked={optionIndex === question.correctAnswer}
                          readOnly
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === "essay" && (
                  <div className="rounded-xl bg-white/50 px-4 py-3 text-brand-300/70">
                    Essay question
                  </div>
                )}

                {question.type === "mcq" &&
                  typeof question.correctAnswer === "number" &&
                  question.options?.[question.correctAnswer] && (
                    <p className="mt-4 rounded-xl bg-green-100/70 px-4 py-3 text-brand-300">
                      <span className="font-semibold">Correct answer:</span>{" "}
                      {question.options[question.correctAnswer]}
                    </p>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}