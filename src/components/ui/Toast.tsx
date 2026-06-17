"use client";

import { useApp } from "@/context/AppContext";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: "border-l-success bg-green-50 dark:bg-green-900/20",
  error: "border-l-red-500 bg-red-50 dark:bg-red-900/20",
  info: "border-l-secondary bg-blue-50 dark:bg-blue-900/20",
  warning: "border-l-warning bg-amber-50 dark:bg-amber-900/20",
};

export function ToastContainer() {
  const { toasts, removeToast } = useApp();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`toast-enter flex items-center gap-3 p-4 rounded-[10px] border-l-4 shadow-lg ${colors[toast.type]}`}
          >
            <Icon size={20} className="shrink-0" />
            <p className="text-sm flex-1 text-title">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-muted hover:text-title">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
