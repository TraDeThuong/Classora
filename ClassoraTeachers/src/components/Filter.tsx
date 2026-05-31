import { useSearchParams } from "react-router-dom";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterProps {
  label: string;
  filterField: string;
  options: FilterOption[];
}

export default function Filter({ label, filterField, options }: FilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentValue = searchParams.get(filterField) ?? options[0]?.value;

  function handleChange(value: string) {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set(filterField, value);

    if (nextSearchParams.get("page")) {
      nextSearchParams.set("page", "1");
    }

    setSearchParams(nextSearchParams);
  }

  return (
    <div className="flex w-full flex-col gap-2 md:w-auto">
      <label className="text-lg font-semibold text-white/80">{label}</label>

      <select
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        className="
          min-w-56
          rounded-2xl border border-white/20
          bg-white/10 px-5 py-3
          text-lg font-medium text-white
          shadow-lg backdrop-blur-xl
          outline-none transition-all duration-300
          hover:bg-white/15
          focus:border-white/40 focus:outline-none focus:ring-0
          sm:min-w-56
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-brand-300 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}