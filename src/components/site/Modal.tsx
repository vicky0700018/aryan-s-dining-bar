import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: ReactNode;
  bare?: boolean;
}

const sizes = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };

export function Modal({ open, onClose, title, children, size = "md", footer, bare }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <button aria-label="Close dialog" className="absolute inset-0 animate-fade-in overlay-scrim backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative flex max-h-[92vh] w-full animate-scale-in flex-col overflow-hidden rounded-t-2xl border border-border-strong bg-surface shadow-[var(--shadow-lux)] sm:rounded-2xl",
          sizes[size],
        )}
      >
        {!bare && (
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
            <h3 className="text-2xl text-foreground">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full border border-border p-1.5 text-muted-foreground transition-colors hover:border-gold hover:text-champagne"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {bare && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 rounded-full border border-border-strong glass p-2 text-champagne transition-colors hover:bg-gold hover:text-primary-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="scrollbar-lux flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  message: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <button className="btn-quiet" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="px-5 py-5 text-sm leading-relaxed text-muted-foreground sm:px-6">{message}</div>
    </Modal>
  );
}
