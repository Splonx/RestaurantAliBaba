"use client";

import { MessageCircle } from "lucide-react";
import { FormEvent, useState } from "react";
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

  function update(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = [
      "Bonjour Restaurant Ali Baba, je souhaite réserver une table.",
      `Nom : ${form.name}`,
      `Téléphone : ${form.phone}`,
      `Date : ${form.date}`,
      `Heure : ${form.time}`,
      `Nombre de personnes : ${form.guests}`,
      `Message : ${form.message}`
    ].join("\n");
    window.open(createWhatsAppUrl(whatsapp, message), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={submit} className="rounded-lg bg-cream p-5 shadow-soft sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom" value={form.name} onChange={(value) => update("name", value)} required autoComplete="name" />
        <Field label="Téléphone" value={form.phone} onChange={(value) => update("phone", value)} required type="tel" autoComplete="tel" />
        <Field label="Date" value={form.date} onChange={(value) => update("date", value)} required type="date" />
        <Field label="Heure" value={form.time} onChange={(value) => update("time", value)} required type="time" />
        <Field label="Nombre de personnes" value={form.guests} onChange={(value) => update("guests", value)} required type="number" min="1" />
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-coffee">Message</span>
          <textarea value={form.message} onChange={(event) => update("message", event.target.value)} className="focus-ring mt-2 min-h-28 w-full resize-y rounded-lg border border-coffee/10 bg-white px-4 py-3 outline-none" placeholder="Occasion, demande spéciale, table familiale..." />
        </label>
      </div>
      <button type="submit" className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-coffee px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-terracotta">
        <MessageCircle size={18} aria-hidden />
        Ouvrir WhatsApp
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  autoComplete,
  min
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  min?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-coffee">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        autoComplete={autoComplete}
        min={min}
        className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 bg-white px-4 py-3 outline-none"
      />
    </label>
  );
}
