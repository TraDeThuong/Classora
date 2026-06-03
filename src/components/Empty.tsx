import type { ReactNode } from "react";

interface EmptyProps {
  resourceName: string;
  children?: ReactNode;
}

export default function Empty({ resourceName, children }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-8 text-center text-brand-300">
      <p>No {resourceName} could be found.</p>
      {children}
    </div>
  );
}
