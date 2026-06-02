import useTeacher from "../features/authentication/useTeacher";

export default function UserAvatar() {
  const { teacher } = useTeacher();

  const fullName = teacher?.full_name || "Teacher";
  const avatar = teacher?.avatar_url || "/default_user.png";

  return (
    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
      <img
        src={avatar}
        alt={`Avatar of ${fullName}`}
        referrerPolicy="no-referrer"
        className="
          h-9 w-9 rounded-full object-cover
          transition-transform duration-300
          hover:rotate-6
          sm:h-11 sm:w-11
          lg:h-14 lg:w-14
        "
      />

      <span
        className="
          hidden max-w-30 truncate
          text-sm font-medium text-brand-200
          sm:block sm:text-base
          lg:max-w-50 lg:text-lg
        "
      >
        {fullName}
      </span>
    </div>
  );
}