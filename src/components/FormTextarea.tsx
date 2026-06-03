import type { TextareaHTMLAttributes } from "react";

export default function FormTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className="
        resize-none
        rounded-2xl
        border border-white/20
        bg-white/10
        px-5 py-4
        text-xl text-white
        outline-none
        transition-all
        placeholder:text-white/40
        focus:border-brand-200
        focus:bg-white/15
      "
    />
  );
}