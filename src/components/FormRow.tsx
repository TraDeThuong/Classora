interface FormRowProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export default function FormRow({
  label,
  error,
  children,
}: FormRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xl font-medium text-white/80">
        {label}
      </label>

      {children}

      {error && (
        <p className="text-lg text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}