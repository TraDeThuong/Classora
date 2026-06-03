import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Empty from "../../components/Empty";
import ErrorMessage from "../../components/ErrorMessage";
import Spinner from "../../components/Spinner";
import StudentAssignmentStatusBadge from "../../features/student/StudentAssignmentStatusBadge";
import {
  useStudentAssignment,
  useSubmitStudentAssignment,
} from "../../features/student/useStudentAssignments";
import type { ResultAnswer } from "../../types/results";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal";

type AnswerDraft = Record<string, ResultAnswer>;

export default function StudentAssignmentTake() {
  const { assignmentId } = useParams();
  const numericAssignmentId = Number(assignmentId);
  const { assignment, error, isLoading } = useStudentAssignment(numericAssignmentId);
  const { submitAssignment, isPending } =
    useSubmitStudentAssignment(numericAssignmentId);
  const [answers, setAnswers] = useState<AnswerDraft>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const existingAnswers = useMemo(() => {
    const answerMap = new Map<string, ResultAnswer>();
    assignment?.answers.forEach((answer) => answerMap.set(answer.questionId, answer));
    return answerMap;
  }, [assignment]);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message="Assignment could not be loaded." />;
  if (!assignment) return <Empty resourceName="assignment" />;

  const hasSubmitted = Boolean(assignment.submitted_at);
  const canSubmit =
    assignment.student_status !== "closed" &&
    assignment.student_status !== "graded";

  function updateMcqAnswer(questionId: string, selectedOption: number) {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        questionId,
        type: "mcq",
        selectedOption,
      },
    }));
  }

  function updateEssayAnswer(questionId: string, text: string) {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        questionId,
        type: "essay",
        text,
      },
    }));
  }

  function handleSubmit() {
    if (!assignment) return;

    const nextAnswers = assignment.questions.map((question) => {
      const draft = answers[question.id];
      const existing = existingAnswers.get(question.id);

      return (
        draft ??
        existing ?? {
          questionId: question.id,
          type: question.type,
          text: question.type === "essay" ? "" : undefined,
        }
      );
    });

    const hasMissingAnswer = assignment.questions.some((question) => {
      const answer = nextAnswers.find((item) => item.questionId === question.id);

      if (!answer) return true;
      if (question.type === "mcq") {
        return typeof answer.selectedOption !== "number";
      }

      return !answer.text?.trim();
    });

    if (hasMissingAnswer) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    setShowConfirmModal(true);

    submitAssignment({
      assignmentId: assignment.id,
      answers: nextAnswers,
    });
  }

  function confirmSubmit() {
  if (!assignment) return;

  const nextAnswers = assignment.questions.map((question) => {
    const draft = answers[question.id];
    const existing = existingAnswers.get(question.id);

    return (
      draft ??
      existing ?? {
        questionId: question.id,
        type: question.type,
        text: question.type === "essay" ? "" : undefined,
      }
    );
  });

  submitAssignment({
    assignmentId: assignment.id,
    answers: nextAnswers,
  });

  setShowConfirmModal(false);
}

  return (
    <div className="space-y-6">
      <Link
        to="/student/assignments"
        className="inline-flex rounded-xl bg-white/70 px-4 py-2 font-semibold text-brand-300"
      >
        Back to assignments
      </Link>

      <section className="rounded-2xl border border-white/60 bg-white/75 p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold text-brand-300">
                {assignment.title}
              </h1>
              <StudentAssignmentStatusBadge status={assignment.student_status} />
            </div>
            <p className="text-brand-300/70">
              {assignment.description || "No description."}
            </p>
            <p className="mt-3 text-sm font-semibold text-brand-200">
              {assignment.class_name} · {assignment.total_score} pts
            </p>
          </div>
          <div className="text-brand-300/80">
            <p className="font-semibold">Due date</p>
            <p>
              {assignment.due_date
                ? new Date(assignment.due_date).toLocaleString("vi-VN")
                : "No due date"}
            </p>
          </div>
        </div>

        {hasSubmitted && (
          <div className="mt-5 rounded-2xl bg-brand-300/10 p-4 text-brand-300">
            <p className="font-semibold">
              Submitted at {new Date(assignment.submitted_at!).toLocaleString("vi-VN")}
            </p>
            {assignment.student_status === "graded" && (
              <p>
                Score: {assignment.score ?? 0}/{assignment.total_score}
              </p>
            )}
            {assignment.feedback && <p>Feedback: {assignment.feedback}</p>}
          </div>
        )}
      </section>

      <section className="space-y-5">
        {assignment.questions.map((question, index) => {
          const existing = existingAnswers.get(question.id);
          const draft = answers[question.id];
          const selectedOption =
            draft?.selectedOption ?? existing?.selectedOption;
          const essayText = draft?.text ?? existing?.text ?? "";

          return (
            <article
              key={question.id}
              className="rounded-2xl border border-white/60 bg-white/75 p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold text-brand-300">
                  {index + 1}. {question.questionText}
                </h2>
                <span className="rounded-full bg-brand-300/10 px-3 py-1 text-sm font-semibold text-brand-300">
                  {question.points} pts
                </span>
              </div>

              {question.type === "mcq" && (
                <div className="space-y-3">
                  {question.options?.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3 text-brand-300"
                    >
                      <input
                        type="radio"
                        name={question.id}
                        checked={selectedOption === optionIndex}
                        disabled={!canSubmit}
                        onChange={() =>
                          updateMcqAnswer(question.id, optionIndex)
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === "essay" && (
                <textarea
                  rows={6}
                  value={essayText}
                  disabled={!canSubmit}
                  onChange={(event) =>
                    updateEssayAnswer(question.id, event.target.value)
                  }
                  placeholder="Write your answer"
                  className="w-full resize-none rounded-xl border border-white/60 bg-white/70 px-4 py-3 text-brand-300 outline-none"
                />
              )}
            </article>
          );
        })}
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={isPending || !canSubmit}
          onClick={handleSubmit}
          className="rounded-2xl bg-brand-300 px-6 py-3 font-semibold text-white hover:bg-brand-400 disabled:opacity-60"
        >
          {isPending ? "Submitting..." : hasSubmitted ? "Update submission" : "Submit assignment"}
        </button>
      </div>
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Submit Assignment"
        message="Are you sure you want to submit this assignment? You can continue editing it until the teacher grades it."
        confirmText="Submit"
        cancelText="Continue Editing"
        isLoading={isPending}
        onConfirm={confirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}
