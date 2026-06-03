import { Link } from "react-router-dom";

interface LogoProps {
  to?: string;
}

export default function Logo({ to = "/teacher/dashboard" }: LogoProps) {
  return (
    <Link
      to={to}
      aria-label="Go to dashboard"
      className="
        flex items-center gap-2
        text-lg font-bold text-brand-200
        transition-opacity hover:opacity-85
        sm:gap-3 sm:text-xl
        lg:gap-4 lg:text-2xl
      "
    >
      <img
        src="/logo.png"
        alt="Classora Logo"
        className="
          h-10 w-10 rounded-full object-cover object-center
          transition-transform duration-300 hover:rotate-6
          sm:h-12 sm:w-12
          lg:h-16 lg:w-16
        "
      />

      <span className="hidden sm:block">
        Classora
      </span>

      <span className="sm:hidden">
        CLS
      </span>
    </Link>
  );
}
