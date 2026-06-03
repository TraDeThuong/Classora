interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-300/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/60 bg-white p-4 shadow-2xl sm:p-5">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-lg">
          ?
        </div>

        <h2 className="mt-3 text-center text-lg font-bold leading-tight text-brand-200 sm:text-xl">
          {title}
        </h2>

        <p className="mt-2 text-center text-sm leading-relaxed text-brand-300/70">
          {message}
        </p>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="min-h-10 flex-1 rounded-lg border border-brand-200 px-3 py-2 text-sm font-semibold text-brand-300 hover:bg-brand-50 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="min-h-10 flex-1 rounded-lg bg-brand-200 px-3 py-2 text-sm font-semibold text-brand-300 hover:bg-brand-400 disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
