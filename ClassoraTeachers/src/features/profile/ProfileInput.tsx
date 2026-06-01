interface ProfileInputProps {
  label: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  register?: any;
}

export default function ProfileInput({
  label,
  value,
  placeholder,
  disabled = false,
  register,
}: ProfileInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm uppercase tracking-wider text-white/50">
        {label}
      </label>

      <input
        {...register}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

