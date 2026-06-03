import type { InputHTMLAttributes } from "react";

export default function FileInput(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className="
        w-full
        rounded-2xl
        border border-white/20
        bg-white/10
        px-5 py-3
        text-xl text-white
        outline-none
        transition-all
        file:mr-4
        file:rounded-xl
        file:border-0
        file:bg-brand-200
        file:px-4
        file:py-2
        file:text-lg
        file:font-medium
        file:text-white
        file:cursor-pointer
        hover:file:bg-brand-300
        focus:border-brand-200
        focus:bg-white/15
      "
    />
  );
}