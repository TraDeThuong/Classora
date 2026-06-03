import type { AssignmentResultRow, ResultAnswer } from "../../types/results";

function getAnswerByQuestion(
  answers: ResultAnswer[],
  questionId: string,
) {
  return answers.find((answer) => answer.questionId === questionId);
}

function getMcqStatus(
  answer: ResultAnswer | undefined,
  correctAnswer: number | undefined,
) {
  if (!answer || typeof answer.selectedOption !== "number") {
    return {
      label: "Unanswered",
      className: "bg-slate-200/20 text-slate-100",
    };
  }

  if (typeof correctAnswer !== "number") {
    return {
      label: "Submitted",
      className: "bg-blue-200/20 text-blue-100",
    };
  }

  const isCorrect = answer.selectedOption === correctAnswer;

  return {
    label: isCorrect ? "Correct" : "Incorrect",
    className: isCorrect
      ? "bg-emerald-200/20 text-emerald-100"
      : "bg-red-200/20 text-red-100",
  };
}

export default function StudentAnswersReview({
  result,
}: {
  result: AssignmentResultRow;
}) {
  return (
    <section className="rounded-2xl bg-white/10 p-4 text-white">
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-2xl font-bold">Student answers</h3>
        <p className="text-sm text-white/60">
          {result.answers.length}/{result.questions.length} questions answered
        </p>
      </div>

      {!result.questions.length ? (
        <p className="rounded-xl bg-white/10 p-4 text-white/70">
          No questions found for this assignment.
        </p>
      ) : (
        <div className="space-y-4">
          {result.questions.map((question, index) => {
            const answer = getAnswerByQuestion(result.answers, question.id);

            if (question.type === "essay") {
              return (
                <article
                  key={question.id}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-brand-100">
                        Question {index + 1} · Essay
                      </p>
                      <h4 className="mt-1 text-lg font-semibold">
                        {question.questionText}
                      </h4>
                    </div>
                    <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white/80">
                      {question.points} pts
                    </span>
                  </div>

                  <div className="rounded-xl bg-white/10 p-4 text-white/80">
                    {answer?.text?.trim() || "No answer submitted."}
                  </div>
                </article>
              );
            }

            const status = getMcqStatus(answer, question.correctAnswer);
            const selectedOption =
              typeof answer?.selectedOption === "number"
                ? question.options?.[answer.selectedOption]
                : null;
            const correctOption =
              typeof question.correctAnswer === "number"
                ? question.options?.[question.correctAnswer]
                : null;

            return (
              <article
                key={question.id}
                className="rounded-2xl border border-white/10 bg-white/10 p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-brand-100">
                      Question {index + 1} · MCQ
                    </p>
                    <h4 className="mt-1 text-lg font-semibold">
                      {question.questionText}
                    </h4>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white/80">
                      {question.points} pts
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-white/80">
                  <p>
                    <span className="font-semibold text-white">
                      Student selected:
                    </span>{" "}
                    {selectedOption ?? "No option selected"}
                  </p>
                  <p>
                    <span className="font-semibold text-white">
                      Correct answer:
                    </span>{" "}
                    {correctOption ?? "Not configured"}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
