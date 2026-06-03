export function MiniSpinner({ color = "primary" }: { color?: "primary" | "white" | "gray" }) {
  const c = {
    primary: "border-[#CECBF6] border-t-[#7F77DD]",
    white:   "border-white/30 border-t-white",
    gray:    "border-border-secondary border-t-text-secondary",
  }[color];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`w-4 h-4 rounded-full border-2 animate-spin shrink-0 ${c}`}
    />
  );
}