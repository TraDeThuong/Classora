import type { SelectHTMLAttributes } from "react";

export default function FormSelect(
  props: SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select
      {...props}
      className="
        rounded-2xl
        border border-white/20
        bg-white/10
        px-5 py-4
        text-xl text-white
        outline-none
        transition-all
        focus:border-brand-200
        focus:bg-white/15
      "
    />
  );
}