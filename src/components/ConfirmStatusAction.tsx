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
    <div className="flex w-160 flex-col gap-5">
      <h3>{title}</h3>

      <p className="mb-5 text-grey-300">{message}</p>

      <div className="flex justify-end gap-5">
        <Button
          variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>

        <Button
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