"use client";

import { useActionState } from "react";
import { createLoyaltyCardAction } from "@/app/admin/actions";

const initialState = {
  ok: false,
  message: ""
};

export default function LoyaltySignupForm() {
  const [state, formAction, pending] = useActionState(
    async (_previousState: typeof initialState, formData: FormData) =>
      createLoyaltyCardAction(formData),
    initialState
  );

  return (
    <form action={formAction} className="grid gap-4 rounded-lg bg-cream p-5 shadow-soft sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="firstName" label="Prénom" required />
        <Field name="lastName" label="Nom" />
      </div>
      <Field name="phone" label="Téléphone" type="tel" required />
      <Field name="email" label="Email" type="email" />
      <label className="flex items-start gap-3 rounded-lg border border-coffee/10 bg-white p-4 text-sm leading-6 text-coffee/70">
        <input
          name="consentAccepted"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 accent-terracotta"
        />
        <span>
          J’accepte les conditions du programme fidélité Ali Baba et l’utilisation de mes
          informations pour créer ma carte digitale.
        </span>
      </label>
      {state.message ? (
        <p className={`rounded-lg px-4 py-3 text-sm ${state.ok ? "bg-olive/10 text-olive" : "bg-terracotta/10 text-terracotta"}`}>
          {state.message}
        </p>
      ) : null}
      <button
        disabled={pending}
        className="focus-ring rounded-lg bg-terracotta px-5 py-4 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-copper disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Création..." : "Créer ma carte"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-coffee">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 bg-white px-4 py-3 text-coffee outline-none"
      />
    </label>
  );
}
