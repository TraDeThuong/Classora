import { useForm, type SubmitHandler } from "react-hook-form";
import FormRow from "../../components/FormRow";
import FormInput from "../../components/FormInput";
import FormTextarea from "../../components/FormTextarea";
import FormSelect from "../../components/FormSelect";
import FileInput from "../../components/FileInput";
import { useCreateClass } from "./useCreateClass";

interface CreateClassFormProps {
  onCloseModal?: () => void;
}

interface ClassFormValues {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  status: "active" | "inactive" | "completed" | "archived";
  room: string;
  image: FileList;
}

export default function CreateClassForm({ onCloseModal }: CreateClassFormProps) {
  const { mutate, isPending: isCreating } = useCreateClass();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFormValues>({
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      maxStudents: 30,
      status: "active",
      room: "",
    },
  });

  const onSubmit: SubmitHandler<ClassFormValues> = (data) => {
    mutate(
      {
        class_name: data.name,
        description: data.description || null,
        max_students: data.maxStudents,
        room: data.room || null,
        start_date: data.startDate,
        end_date: data.endDate,
        status: data.status,
        thumbnail: data.image,
      },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FormRow label="Class name" error={errors.name?.message}>
        <FormInput {...register("name", { required: "Class name is required" })} />
      </FormRow>

      <FormRow label="Maximum Students" error={errors.maxStudents?.message}>
        <FormInput
          type="number"
          {...register("maxStudents", {
            required: "Maximum Students is required",
            valueAsNumber: true,
            min: { value: 1, message: "Must be at least 1 student" },
          })}
        />
      </FormRow>

      <FormRow label="Online Meeting Link" error={errors.room?.message}>
        <FormInput {...register("room", { required: "Meeting link is required" })} />
      </FormRow>

      <FormRow label="Description">
        <FormTextarea rows={4} {...register("description")} />
      </FormRow>

      <FormRow label="Thumbnail" error={errors.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          type="file"
          {...register("image", { required: "Image is required" })}
        />
      </FormRow>

      <div className="grid grid-cols-2 gap-4">
        <FormRow label="Start date" error={errors.startDate?.message}>
          <FormInput type="date" {...register("startDate", { required: "Start date is required" })} />
        </FormRow>

        <FormRow label="End date" error={errors.endDate?.message}>
          <FormInput type="date" {...register("endDate", { required: "End date is required" })} />
        </FormRow>
      </div>

      <FormRow label="Status">
        <FormSelect {...register("status")}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </FormSelect>
      </FormRow>

      <div className="mt-4 flex justify-end gap-4">
        <button type="button" onClick={onCloseModal} className="rounded-2xl border border-white/20 px-6 py-3 text-xl font-medium text-white/70 transition-all hover:bg-white/10 focus:outline-none">
          Cancel
        </button>

        <button type="submit" disabled={isCreating} className="rounded-2xl bg-brand-200 px-6 py-3 text-xl font-semibold text-white transition-all hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none">
          {isCreating ? "Creating..." : "Create class"}
        </button>
      </div>
    </form>
  );
}