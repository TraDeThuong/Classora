
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
    <div className="flex w-160 flex-col gap-5">
      <h3>Delete {resourceName}</h3>

      <p className="mb-5 text-grey-300">
        Are you sure you want to delete this {resourceName} permanently? This
        action cannot be undone.
      </p>

      <div className="flex justify-end gap-5">
        <Button
          variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>

        <Button
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