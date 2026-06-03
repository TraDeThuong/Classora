
import Button from "./Button";

interface ConfirmDeleteProps {
  resourceName: string;
  onConfirm: () => void;
  disabled?: boolean;
  onCloseModal?: () => void;
}

export default function ConfirmDelete({
  resourceName,
  onConfirm,
  disabled = false,
  onCloseModal,
}: ConfirmDeleteProps) {
  return (
    <div className="flex w-full flex-col gap-3 text-brand-300">
      <h3 className="pr-8 text-xl font-bold leading-tight sm:text-2xl">
        Delete {resourceName}
      </h3>

      <p className="text-sm leading-relaxed text-white/70 sm:text-base">
        Are you sure you want to delete this {resourceName} permanently? This
        action cannot be undone.
      </p>

      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end [&>button]:justify-center">
        <Button
          size="small"
          variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>

        <Button
          size="small"
          variation="danger"
          disabled={disabled}
          onClick={onConfirm}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
