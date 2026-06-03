"use client";

import { Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteReservationAction, updateReservationAction } from "@/app/admin/actions";
import Toast, { type ToastState } from "@/components/admin/Toast";

type ReservationRow = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  message: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
};

export default function ReservationManager({ reservations }: { reservations: ReservationRow[] }) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState>(null);
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      const result = await updateReservationAction(formData);
      setToast(result);
      if (result.ok) router.refresh();
    });
  }

  function remove(id: string) {
    if (!confirm("Supprimer cette réservation ?")) return;
    startTransition(async () => {
      const result = await deleteReservationAction(id);
      setToast(result);
      if (result.ok) router.refresh();
    });
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="grid gap-4 xl:grid-cols-2">
        {reservations.length === 0 ? (
          <div className="rounded-lg bg-cream p-10 text-center text-coffee/55 shadow-admin xl:col-span-2">
            Aucune demande de réservation pour le moment.
          </div>
        ) : reservations.map((reservation) => (
          <form key={reservation.id} action={submit} className="rounded-lg bg-cream p-5 shadow-admin">
            <input type="hidden" name="id" value={reservation.id} />
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-3xl font-semibold text-coffee">{reservation.name}</p>
                <p className="mt-1 text-sm text-coffee/60">{reservation.createdAt}</p>
              </div>
              <select name="status" defaultValue={reservation.status} className="focus-ring rounded-lg border border-coffee/10 bg-white px-3 py-2 text-sm font-semibold">
                <option value="nouvelle">Nouvelle</option>
                <option value="confirmée">Confirmée</option>
                <option value="en attente">En attente</option>
                <option value="annulée">Annulée</option>
              </select>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Field name="name" label="Nom" value={reservation.name} />
              <Field name="phone" label="Téléphone" value={reservation.phone} />
              <Field name="date" label="Date" value={reservation.date} type="date" />
              <Field name="time" label="Heure" value={reservation.time} type="time" />
              <Field name="guests" label="Personnes" value={String(reservation.guests)} type="number" />
            </div>
            <label className="mt-3 block">
              <span className="text-sm font-semibold">Message</span>
              <textarea name="message" defaultValue={reservation.message ?? ""} className="focus-ring mt-2 min-h-20 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" />
            </label>
            <label className="mt-3 block">
              <span className="text-sm font-semibold">Notes internes</span>
              <textarea name="notes" defaultValue={reservation.notes ?? ""} className="focus-ring mt-2 min-h-20 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" />
            </label>
            <div className="mt-4 flex gap-2">
              <button disabled={pending} className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-coffee px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-cream">
                <Save size={16} aria-hidden />
                Enregistrer
              </button>
              <button type="button" onClick={() => remove(reservation.id)} className="focus-ring rounded-lg border border-terracotta/20 px-4 py-3 text-terracotta">
                <Trash2 size={16} aria-hidden />
              </button>
            </div>
          </form>
        ))}
      </div>
    </>
  );
}

function Field({
  name,
  label,
  value,
  type = "text"
}: {
  name: string;
  label: string;
  value: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input name={name} defaultValue={value} type={type} min={type === "number" ? 1 : undefined} className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" />
    </label>
  );
}
