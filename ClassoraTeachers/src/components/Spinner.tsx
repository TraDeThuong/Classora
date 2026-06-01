interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "teal" | "gray" | "white";
  fullHeight?: boolean;
}

const sizes = {
  sm: "h-6 w-6 border-2",
  md: "h-12 w-12 border-[3px]",
  lg: "h-24 w-24 border-4",
};

const colors = {
  primary: "border-[#CECBF6] border-t-[#7F77DD]",
  teal: "border-[#9FE1CB] border-t-[#1D9E75]",
  gray: "border-border-secondary border-t-text-secondary",
  white: "border-white/30 border-t-white",
};

export default function Spinner({
  size = "md",
  color = "primary",
  fullHeight = false,
}: SpinnerProps) {
  return (
    <div
      className={`
        flex justify-center items-center
        ${fullHeight ? "h-full" : ""}
      `}
    >
      <div
        role="status"
        aria-label="Loading"
        className={`
          animate-spin rounded-full
          ${sizes[size]}
          ${colors[color]}
        `}
      />
    </div>
  );
}