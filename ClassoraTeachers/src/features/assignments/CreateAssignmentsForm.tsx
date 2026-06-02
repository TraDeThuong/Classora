import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import FormRow from "../../components/FormRow";
import FormInput from "../../components/FormInput";
import FormTextarea from "../../components/FormTextarea";
import FormSelect from "../../components/FormSelect";
import { getAssignmentType } from "../../utils/getAssignmentType";
import { useCreateAssignment } from "./useCreateAssignment";
import { useClasses } from "../classes/useClasses";
import type { NewAssignment } from "../../services/apiAssignments";
import toast from "react-hot-toast";
import { useUpdateAssignment } from "./useUpdateAssignment";

type QuestionType = "" | "mcq" | "essay";

interface QuestionFormValues {
  type: QuestionType;
  questionText: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer?: "A" | "B" | "C" | "D";
  points: number;
}

interface AssignmentFormValues {
  classId: string;
  title: string;
  description: string;
  totalScore: number;
  dueDate: string;
  allowLateSubmit: boolean;
  publishTime: string;
  questions: QuestionFormValues[];
  status: "draft" | "published" | "archived";
}

interface CreateAssignmentsFormProps {
  assignmentToEdit?: any;
  onCloseModal?: () => void;
}


export default function CreateAssignmentsForm({onCloseModal, assignmentToEdit} : CreateAssignmentsFormProps) {
  const { classes = [] } = useClasses();
  const { mutate, isPending: isCreating } = useCreateAssignment();
  const { editAssignment, isEditing } = useUpdateAssignment();
  const isWorking = isCreating || isEditing;

  const isEditSession = Boolean(assignmentToEdit?.id);
  const editId = assignmentToEdit?.id;

  const formatQuestionsForForm = (questions: any[] = []): QuestionFormValues[] => {
    return questions.map((question): QuestionFormValues => {
      let correctAnswer: "A" | "B" | "C" | "D" | undefined;

      if (question.correctAnswer === 0) correctAnswer = "A";
      else if (question.correctAnswer === 1) correctAnswer = "B";
      else if (question.correctAnswer === 2) correctAnswer = "C";
      else if (question.correctAnswer === 3) correctAnswer = "D";
      else correctAnswer = undefined;

      return {
        type: question.type === "mcq" ? "mcq" : "essay",
        questionText: question.questionText ?? "",
        points: question.points ?? 1,

        optionA: question.options?.[0] ?? "",
        optionB: question.options?.[1] ?? "",
        optionC: question.options?.[2] ?? "",
        optionD: question.options?.[3] ?? "",

        correctAnswer,
      };
    });
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AssignmentFormValues>({
    defaultValues: isEditSession
      ? {
          classId: String(assignmentToEdit.class_id),
          title: assignmentToEdit.title,
          description: assignmentToEdit.description ?? "",
          totalScore: assignmentToEdit.total_score ?? 10,
          dueDate: assignmentToEdit.due_date
            ? new Date(assignmentToEdit.due_date)
                .toISOString()
                .slice(0, 16)
            : "",
          allowLateSubmit: assignmentToEdit.allow_late_submit ?? false,
          publishTime: assignmentToEdit.published_at
            ? new Date(assignmentToEdit.published_at)
                .toISOString()
                .slice(0, 16)
            : "",
          status: assignmentToEdit.status ?? "draft",
          questions: formatQuestionsForForm(assignmentToEdit.questions),
        }
      : {
          classId: "",
          title: "",
          description: "",
          totalScore: 10,
          dueDate: "",
          allowLateSubmit: false,
          publishTime: "",
          status: "draft",
          questions: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const questions = watch("questions");
  const now = new Date();

  const toDate = (value: string) => new Date(value);

  const dueDate = watch("dueDate");
  const publishTime = watch("publishTime");
  

  const onSubmit: SubmitHandler<AssignmentFormValues> = (data) => {
  if (data.questions.length === 0) {
    toast.error("Assignment must contain at least one question");
    return;
  }

  const totalQuestionPoints = data.questions.reduce(
    (sum, question) => sum + Number(question.points || 0),
    0,
  );

  if (totalQuestionPoints !== data.totalScore) {
    toast.error("Total question points must equal total score");
    return;
  }

  const hasInvalidQuestion = data.questions.some(
      (question) => question.type === ""
    );

    if (hasInvalidQuestion) {
      toast.error("All questions must have a type");
      return;
    }

  const assignmentType = getAssignmentType(data.questions);

  const newAssignment: NewAssignment = {
    class_id: Number(data.classId),
    title: data.title,
    description: data.description || null,
    type: assignmentType,
    total_score: data.totalScore,
    due_date: data.dueDate || null,
    status: data.status,
    allow_late_submit: data.allowLateSubmit,
    published_at: data.publishTime || null,

    questions: data.questions.map((question, index) => ({
      id: crypto.randomUUID(),
      order: index + 1,
      type: question.type === "mcq" ? "mcq" : "essay",
      questionText: question.questionText,
      points: question.points,
      options:
        question.type === "mcq"
          ? [
              question.optionA,
              question.optionB,
              question.optionC,
              question.optionD,
            ].filter((option): option is string => Boolean(option))
          : undefined,
      correctAnswer:
        question.type === "mcq"
          ? question.correctAnswer === "A"
            ? 0
            : question.correctAnswer === "B"
            ? 1
            : question.correctAnswer === "C"
            ? 2
            : 3
          : undefined,
    })),
  };

  if (isEditSession) {
    editAssignment(
      { id: editId, newData: newAssignment },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      }
    );
  } else {
    mutate(newAssignment, {
      onSuccess: () => {
        reset();
        onCloseModal?.();
      },
    });
  }
  };

  return (
  <div className = "flex flex-col items-center">
    <h1 className = "font-bold mb-5 text-brand-100 " >CREATE ASSIGNMENT </h1>
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto space-y-6">
      <FormRow label="Class" error={errors.classId?.message}>
        <FormSelect
          {...register("classId", {
            required: "Class is required",
          })}
        >
          <option value="">Select class</option>

          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.class_name}
            </option>
          ))}
        </FormSelect>
      </FormRow>

      <FormRow label="Title" error={errors.title?.message}>
        <FormInput
          {...register("title", {
            required: "Title is required",
          })}
        />
      </FormRow>

      <FormRow label="Description">
        <FormTextarea rows={4} {...register("description")} />
      </FormRow>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormRow label="Total Score" error={errors.totalScore?.message}>
          <FormInput
            type="number"
            {...register("totalScore", {
              required: "Total score is required",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Total score must be at least 1",
              },
            })}
          />
        </FormRow>

        <FormRow label="Due Date" error={errors.dueDate?.message}>
          <FormInput
            type="datetime-local"
            min={new Date().toISOString().slice(0, 16)}
            {...register("dueDate", {
              required: "Due date is required",
              validate: (value) => {
                const due = toDate(value);

                if (!isEditSession && due <= now) {
                  return "Due date must be later than today";
                }

                if (publishTime && due <= toDate(publishTime)) {
                  return "Due date must be after publish time";
                }

                return true;
              },
            })}
          />
        </FormRow>
      </div>

      <FormRow label="Publish Time" error={errors.publishTime?.message}>
        <FormInput
          type="datetime-local"
          min={new Date().toISOString().slice(0, 16)}
          {...register("publishTime", {
            required: "Publish time is required",
            validate: (value) => {
              const publish = toDate(value);

              if (!isEditSession && publish < now) {
                return "Publish time cannot be in the past";
              }

              if (dueDate && publish >= toDate(dueDate)) {
                return "Publish time must be before due date";
              }

              return true;
            },
          })}
        />
      </FormRow>

      <FormRow label="Status" error={errors.status?.message}>
        <FormSelect {...register("status", {
          required: "Status is required",
        })}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </FormSelect>
      </FormRow>

      <label className="flex items-center gap-3 text-xl text-white/80">
        <input
          type="checkbox"
          className="h-5 w-5 accent-brand-200"
          {...register("allowLateSubmit")}
        />
        Allow late submit
      </label>

      <div className="flex flex-col gap-5">
        {fields.map((field, index) => {
          const type = questions?.[index]?.type;

          return (
            <div
              key={field.id}
              className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-white">
                  Question {index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="rounded-xl px-4 py-2 text-lg text-red-300 transition-all hover:bg-red-400/10"
                >
                  Remove
                </button>
              </div>

              <div className="flex flex-col gap-5">
                <FormRow
                  label="Question Type"
                  error={errors.questions?.[index]?.type?.message}
                >
                  <FormSelect
                    {...register(`questions.${index}.type`, {
                      required: "Question type is required",
                    })}
                  >
                    <option value="">Select type</option>
                    <option value="mcq">Multiple Choice</option>
                    <option value="essay">Essay</option>
                  </FormSelect>
                </FormRow>

                {type && (
                  <>
                    <FormRow
                      label="Question"
                      error={errors.questions?.[index]?.questionText?.message}
                    >
                      <FormTextarea
                        rows={3}
                        {...register(`questions.${index}.questionText`, {
                          required: "Question is required",
                        })}
                      />
                    </FormRow>

                    <FormRow
                      label="Points"
                      error={errors.questions?.[index]?.points?.message}
                    >
                      <FormInput
                        type="number"
                        {...register(`questions.${index}.points`, {
                          required: "Points is required",
                          valueAsNumber: true,
                          min: {
                            value: 1,
                            message: "Points must be at least 1",
                          },
                        })}
                      />
                    </FormRow>
                  </>
                )}

                {type === "mcq" && (
                  <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormRow label="Answer A">
                        <FormInput
                          {...register(`questions.${index}.optionA`, {
                            required: "Answer A is required",
                          })}
                        />
                      </FormRow>

                      <FormRow label="Answer B">
                        <FormInput
                          {...register(`questions.${index}.optionB`, {
                            required: "Answer B is required",
                          })}
                        />
                      </FormRow>

                      <FormRow label="Answer C">
                        <FormInput
                          {...register(`questions.${index}.optionC`, {
                            required: "Answer C is required",
                          })}
                        />
                      </FormRow>

                      <FormRow label="Answer D">
                        <FormInput
                          {...register(`questions.${index}.optionD`, {
                            required: "Answer D is required",
                          })}
                        />
                      </FormRow>
                    </div>

                    <FormRow
                      label="Correct Answer"
                      error={errors.questions?.[index]?.correctAnswer?.message}
                    >
                      <FormSelect
                        {...register(`questions.${index}.correctAnswer`, {
                          required: "Correct answer is required",
                        })}
                      >
                        <option value="">Select correct answer</option>
                        <option value="A">Answer A</option>
                        <option value="B">Answer B</option>
                        <option value="C">Answer C</option>
                        <option value="D">Answer D</option>
                      </FormSelect>
                    </FormRow>
                  </>
                )}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() =>
            append({
              type: "",
              questionText: "",
              optionA: "",
              optionB: "",
              optionC: "",
              optionD: "",
              correctAnswer: undefined,
              points: 1,
            })
          }
          className="flex h-16 items-center justify-center rounded-3xl border border-dashed border-white/30 bg-white/10 text-4xl font-light text-white/70 transition-all hover:bg-white/20"
        >
          +
        </button>
      </div>

      <div className="mt-4 flex justify-end gap-4">
        <button
          type="submit"
          disabled={isWorking}
          className="rounded-2xl bg-brand-200 px-6 py-3 text-xl font-semibold text-white transition-all hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isWorking
            ? isEditSession
              ? "Updating..."
              : "Creating..."
            : isEditSession
            ? "Update Assignment"
            : "Create Assignment"}
        </button>
      </div>
    </form>
  </div>
  );
}