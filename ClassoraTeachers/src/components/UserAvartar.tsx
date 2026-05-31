import useTeacher from "../features/authentication/useTeacher";

export default function UserAvatar() {
  const { teacher } = useTeacher();

  const fullName = teacher?.full_name 

  const avatar = teacher?.avatar_url || "public/default_user.png";

  return (
    <div className="flex items-center gap-5 text-2xl font-medium text-brand-200">
      <img
        src={avatar}
        alt={`Avatar of ${fullName}`}
        referrerPolicy="no-referrer"
        className="
          block h-14 w-14 rounded-full
          object-cover object-center
          transition-transform duration-300
          hover:rotate-8
        "
      />

      <span>{fullName}</span>
    </div>
  );
}