"use client";

import { CheckCircle2, XCircle } from "lucide-react";

export type ToastState = {
  ok: boolean;
  message: string;
} | null;

export default function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  if (!toast) return null;
  const Icon = toast.ok ? CheckCircle2 : XCircle;

  return (
    <div className="fixed right-4 top-4 z-[100] max-w-sm rounded-lg border border-charcoal/10 bg-white p-4 shadow-admin">
      <div className="flex gap-3">
        <Icon className={toast.ok ? "text-olive" : "text-terracotta"} size={22} aria-hidden />
        <div>
          <p className="font-semibold text-coffee">{toast.ok ? "Succès" : "Erreur"}</p>
          <p className="mt-1 text-sm text-coffee/70">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="focus-ring ml-auto text-sm font-semibold text-coffee/60 hover:text-coffee"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
