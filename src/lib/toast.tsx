import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type Variant = "success" | "error" | "info";
interface ToastItem {
  id: number;
  title: string;
  description?: string | undefined;
  variant: Variant;
}

const ToastContext = createContext<(t: Omit<ToastItem, "id" | "variant"> & { variant?: Variant }) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((t: Omit<ToastItem, "id" | "variant"> & { variant?: Variant }) => {
    const id = Date.now() + Math.random();
    setItems((list) => [...list, { id, ...t, variant: t.variant ?? ("success" as Variant) }].slice(-4));
    window.setTimeout(() => setItems((list) => list.filter((x) => x.id !== id)), 3800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6">
        {items.map((t) => {
          const Icon = t.variant === "error" ? AlertTriangle : t.variant === "info" ? Info : CheckCircle2;
          const tone = t.variant === "error" ? "text-destructive" : t.variant === "info" ? "text-info" : "text-success";
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm animate-scale-in items-start gap-3 rounded-xl border border-border-strong bg-surface p-4 shadow-[var(--shadow-lux)]"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>}
              </div>
              <button
                aria-label="Dismiss notification"
                onClick={() => setItems((l) => l.filter((x) => x.id !== t.id))}
                className="text-muted-foreground transition-colors hover:text-champagne"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
