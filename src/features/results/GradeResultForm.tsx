import { useForm, type SubmitHandler } from "react-hook-form";
import type { AssignmentResultRow } from "../../types/results";
import { useGradeResult } from "./useGradeResult";
import StudentAnswersReview from "./StudentAnswersReview";

interface GradeResultFormProps {
  result: AssignmentResultRow;
  onCloseModal?: () => void;
}

interface GradeResultFormValues {
  score: number;
  feedback: string;
}

function calculateSuggestedScore(result: AssignmentResultRow) {
  const mcqQuestions = result.questions.filter(
    (question) => question.type === "mcq",
  );

  if (!mcqQuestions.length || !result.answers.length) {
    return result.score ?? 0;
  }

  return mcqQuestions.reduce((total, question) => {
    const answer = result.answers.find(
      (item) => item.questionId === question.id,
    );

    if (answer?.selectedOption === question.correctAnswer) {
      return total + question.points;
    }

    return total;
  }, 0);
}

export default function GradeResultForm({
  result,
  onCloseModal,
}: GradeResultFormProps) {
  const { grade, isGrading } = useGradeResult(result.assignment_id);
  const suggestedScore = calculateSuggestedScore(result);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GradeResultFormValues>({
    defaultValues: {
      score: suggestedScore,
      feedback: result.feedback ?? "",
    },
  });

  const onSubmit: SubmitHandler<GradeResultFormValues> = (data) => {
    if (!result.result_id) return;

    grade(
      {
        resultId: result.result_id,
        score: data.score,
        feedback: data.feedback.trim() || null,
      },
      {
        onSuccess: () => onCloseModal?.(),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Grade submission</h2>
        <p className="mt-2 text-lg text-white/60">
          {result.student_name} · {result.assignment_title}
        </p>
      </div>

      <div className="rounded-2xl bg-white/10 p-4 text-white/80">
        <p>
          Suggested score:{" "}
          <span className="font-semibold text-brand-100">
            {suggestedScore}/{result.total_score}
          </span>
        </p>
      </div>

      <StudentAnswersReview result={result} />

      <div>
        <label className="mb-2 block text-lg font-semibold text-white">
          Score
        </label>
        <input
          type="number"
          step="0.25"
          min={0}
          max={result.total_score}
          {...register("score", {
            required: "Score is required",
            valueAsNumber: true,
            min: {
              value: 0,
              message: "Score cannot be negative",
            },
            max: {
              value: result.total_score,
              message: `Score cannot exceed ${result.total_score}`,
            },
          })}
          className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none"
        />
        {errors.score && (
          <p className="mt-2 text-sm text-red-300">{errors.score.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-lg font-semibold text-white">
          Feedback
        </label>
        <textarea
          rows={5}
          {...register("feedback")}
          className="w-full resize-none rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none"
          placeholder="Write feedback for this student"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCloseModal}
          className="rounded-2xl bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isGrading || !result.result_id}
          className="rounded-2xl bg-brand-200 px-5 py-3 font-semibold text-white hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGrading ? "Saving..." : "Save grade"}
        </button>
      </div>
    </form>
  );
}
