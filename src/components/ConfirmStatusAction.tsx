import Button from "./Button";

interface ConfirmStatusActionProps {
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariation?: "primary" | "secondary" | "danger";
  status?: "draft" | "published" | "archived";
  disabled?: boolean;
  onConfirm: () => void;
  onCloseModal?: () => void;
}

export default function ConfirmStatusAction({
  title,
  message,
  confirmLabel,
  confirmVariation = "primary",
  disabled = false,
  onConfirm,
  onCloseModal,
}: ConfirmStatusActionProps) {
  return (
    <div className="flex w-full flex-col gap-3 text-brand-300">
      <h3 className="pr-8 text-3xl font-bold leading-tight ">
        {title}
      </h3>

      <p className="text-xl leading-relaxed text-white/70 sm:text-base">
        {message}
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
          variation={confirmVariation}
          disabled={disabled}
          onClick={() => {
            onConfirm();
            onCloseModal?.();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
