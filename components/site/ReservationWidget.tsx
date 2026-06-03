"use client";

import { CalendarClock, MessageCircle } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { createReservationAction } from "@/app/admin/actions";
import { createWhatsAppUrl } from "@/lib/whatsapp";

type FormState = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  date: "",
  time: "",
  guests: "",
  message: ""
};

export default function ReservationWidget({ whatsapp }: { whatsapp: string }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [notice, setNotice] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, setPending] = useState(false);

  const todayQuickMessage = useMemo(
    () =>
      "Bonjour Restaurant Ali Baba, je souhaite réserver aujourd’hui.\nNom :\nHeure :\nNombre de personnes :",
    []
  );

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPending(true);
    createReservationAction(formData).then((result) => {
      setNotice(result);
      setPending(false);
      if (result.ok) setForm(initialState);
    });
  }

  return (
    <div className="rounded-lg border border-coffee/10 bg-cream p-5 shadow-soft sm:p-7">
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={createWhatsAppUrl(whatsapp, todayQuickMessage)}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white"
        >
          <CalendarClock size={16} aria-hidden />
          Réserver en 15s
        </a>
        <a
          href={createWhatsAppUrl(
            whatsapp,
            "Bonjour Restaurant Ali Baba, je souhaite réserver pour un événement de groupe."
          )}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-[#11151e] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-cream"
        >
          <MessageCircle size={16} aria-hidden />
          Réservation groupe
        </a>
      </div>

      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Nom" value={form.name} onChange={(value) => update("name", value)} required />
        <Field name="phone" label="Téléphone" value={form.phone} onChange={(value) => update("phone", value)} required type="tel" />
        <Field name="date" label="Date" value={form.date} onChange={(value) => update("date", value)} required type="date" />
        <Field name="time" label="Heure" value={form.time} onChange={(value) => update("time", value)} required type="time" />
        <Field
          name="guests"
          label="Personnes"
          value={form.guests}
          onChange={(value) => update("guests", value)}
          required
          type="number"
          min="1"
        />
        <label className="block sm:col-span-2">
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-coffee/75">Message</span>
          <textarea
            name="message"
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
            className="focus-ring mt-2 min-h-24 w-full rounded-lg border border-coffee/10 bg-white px-4 py-3 text-sm outline-none"
          />
        </label>
        {notice ? (
          <p className={`sm:col-span-2 text-sm font-semibold ${notice.ok ? "text-olive" : "text-terracotta"}`}>
            {notice.message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="focus-ring sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-terracotta"
        >
          <MessageCircle size={18} aria-hidden />
          {pending ? "Envoi..." : "Envoyer la demande"}
        </button>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  value,
  onChange,
  required,
  type = "text",
  min
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  min?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.1em] text-coffee/75">{label}</span>
      <input
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        min={min}
        className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 bg-white px-4 py-3 text-sm outline-none"
      />
    </label>
  );
}
