import { useForm } from "react-hook-form";

import Button from "../../components/Button";
import FullPageLoader from "../../components/FullPageLoader";
import useTeacher from "../authentication/useTeacher";
import useUpdateTeacherProfile from "./useUpdateTeacherProfile";
import ProfileInput from "./ProfileInput";

interface TeacherProfileForm {
  full_name: string;
  avatar_url: string;
  bio: string;
  phone: string;
  degree: string;
  specialization: string;
}

export default function TeacherProfile() {
  const { teacher, isLoading } = useTeacher();
  const { updateProfile, isUpdating } = useUpdateTeacherProfile();

  const { register, handleSubmit } = useForm<TeacherProfileForm>({
    values: {
      full_name: teacher?.full_name || "",
      avatar_url: teacher?.avatar_url || "",
      bio: teacher?.bio || "",
      phone: teacher?.phone || "",
      degree: teacher?.degree || "",
      specialization: teacher?.specialization || "",
    },
  });

  if (isLoading) return <FullPageLoader />;

  function onSubmit(data: TeacherProfileForm) {
    updateProfile(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto grid w-full max-w-480 grid-cols-1 gap-5 px-2 sm:gap-8 sm:px-4 lg:grid-cols-[32rem_1fr]"
    >
      <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1  hover:shadow-2xl hover:border-brand-200/40">
        <img
          src={teacher?.avatar_url || "https://i.pravatar.cc/300"}
          alt={teacher?.full_name || "Teacher avatar"}
          className="  mx-auto h-40 w-40 rounded-full border-4 border-brand-200 object-cover transition-all duration-300 hover:scale-105 hover:rotate-1 hover:shadow-[0_0_30px_rgba(206,203,246,0.5)]"
        />

        <input
          {...register("full_name")}
          placeholder="Enter full name"
          className="mt-5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-3xl font-bold text-white outline-none placeholder:text-white/40"
        />

        <p className="mt-2 text-xl text-white/60">
          {teacher?.specialization || "Enter specialization"}
        </p>

        <div className="mt-4 inline-block rounded-full bg-green-500/20 px-4 py-2 text-green-300">
          {teacher?.status || "active"}
        </div>
      </div>

      <div className="space-y-8">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1  hover:shadow-2xl hover:border-brand-200/40">
          <h1 className="mb-4 text-2xl font-semibold text-brand-200">
            About me
          </h1>

          <textarea
            {...register("bio")}
            placeholder="Enter your bio"
            rows={6}
            className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40"
          />
        </div>

        <div className="rrounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1  hover:shadow-2xl hover:border-brand-200/40">
          <h1 className="mb-6 text-2xl font-semibold text-brand-200">
            Information
          </h1>

          <div className="grid grid-cols-1 gap-5 ">
            <ProfileInput
              label="Email"
              value={teacher?.email || "No email"}
              disabled
            />

            <ProfileInput
              label="Phone"
              placeholder="Enter phone number"
              register={register("phone")}
            />

            <ProfileInput
              label="Degree"
              placeholder="Enter degree"
              register={register("degree")}
            />

            <ProfileInput
              label="Specialization"
              placeholder="Enter specialization"
              register={register("specialization")}
            />
          </div>

          <div className="mt-8 flex justify-end">
            <Button type="submit" size="large" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

