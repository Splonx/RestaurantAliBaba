"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { saveSettingsAction } from "@/app/admin/actions";
import Toast, { type ToastState } from "@/components/admin/Toast";
import { settingsSchema, type SettingsInput } from "@/lib/validators";

export default function SettingsForm({ settings }: { settings: SettingsInput }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, formState } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings
  });

  function submit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    startTransition(async () => {
      const result = await saveSettingsAction(formData);
      setToast(result);
      if (result.ok) router.refresh();
    });
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <form ref={formRef} onSubmit={handleSubmit(submit)} className="rounded-lg bg-cream p-6 shadow-admin">
        <div className="grid gap-5 lg:grid-cols-2">
          {[
            ["heroTitle", "Titre hero"],
            ["heroSubtitle", "Sous-titre hero"],
            ["phone", "Téléphone"],
            ["landline", "Téléphone fixe"],
            ["whatsapp", "WhatsApp"],
            ["address", "Adresse"],
            ["instagram", "Instagram"],
            ["instagramUrl", "URL Instagram"],
            ["hours", "Horaires"]
          ].map(([name, label]) => (
            <label key={name} className={name === "heroSubtitle" || name === "address" ? "block lg:col-span-2" : "block"}>
              <span className="text-sm font-semibold text-coffee">{label}</span>
              <input
                className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none"
                {...register(name as keyof SettingsInput)}
                name={name}
              />
              {formState.errors[name as keyof SettingsInput] ? (
                <p className="mt-1 text-xs text-terracotta">Champ à vérifier.</p>
              ) : null}
            </label>
          ))}

          <label className="block lg:col-span-2">
            <span className="text-sm font-semibold text-coffee">Texte de présentation</span>
            <textarea className="focus-ring mt-2 min-h-36 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("aboutText")} name="aboutText" />
          </label>
          <label className="block lg:col-span-2">
            <span className="text-sm font-semibold text-coffee">Texte footer</span>
            <textarea className="focus-ring mt-2 min-h-28 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("footerText")} name="footerText" />
          </label>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="focus-ring mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-coffee px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-terracotta disabled:opacity-60"
        >
          <Save size={17} aria-hidden />
          {pending ? "Enregistrement..." : "Enregistrer le contenu"}
        </button>
      </form>
    </>
  );
}
