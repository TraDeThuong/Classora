import Spinner from "./Spinner";

interface FullPageLoaderProps {
  text?: string;
}

export default function FullPageLoader({
  text = "Loading...",
}: FullPageLoaderProps) {
  return (
    <div
      className=" fixed inset-0 z-9999 flex flex-col items-center justify-center gap-8 bg-black/30 backdrop-blur-md animate-in fade-in duration-300">
      <Spinner size="lg" />

      <p
        className=" text-2xl font-medium tracking-wide text-white">
        {text}
      </p>
    </div>
  );
}