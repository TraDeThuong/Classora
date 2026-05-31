type QuestionType = "" | "mcq" | "essay";

interface Question {
  type: QuestionType;
}

export function getAssignmentType(
  questions: Question[]
): "mcq" | "essay" | "mixed" {
  const validQuestions = questions.filter(
    (q) => q.type !== ""
  );

  if (validQuestions.length === 0) return "mcq";

  const allMcq = validQuestions.every(
    (q) => q.type === "mcq"
  );

  if (allMcq) return "mcq";

  const allEssay = validQuestions.every(
    (q) => q.type === "essay"
  );

  if (allEssay) return "essay";

  return "mixed";
}