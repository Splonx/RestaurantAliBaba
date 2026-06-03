"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { deleteTestimonialAction, saveTestimonialAction } from "@/app/admin/actions";
import Toast, { type ToastState } from "@/components/admin/Toast";

type TestimonialRow = {
  id: string;
  author: string;
  quote: string;
  context: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
};

const empty = {
  id: "",
  author: "",
  quote: "",
  context: "",
  isFeatured: true,
  isActive: true,
  sortOrder: 0
};

export default function TestimonialManager({ testimonials }: { testimonials: TestimonialRow[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [editing, setEditing] = useState(empty);
  const [toast, setToast] = useState<ToastState>(null);
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      const result = await saveTestimonialAction(formData);
      setToast(result);
      if (result.ok) {
        setEditing(empty);
        formRef.current?.reset();
        router.refresh();
      }
    });
  }

  function remove(id: string) {
    if (!confirm("Supprimer cet avis ?")) return;
    startTransition(async () => {
      const result = await deleteTestimonialAction(id);
      setToast(result);
      if (result.ok) router.refresh();
    });
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form ref={formRef} action={submit} className="rounded-lg bg-cream p-6 shadow-admin">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-coffee">{editing.id ? "Modifier" : "Ajouter"} un avis</h2>
            <button type="button" onClick={() => setEditing(empty)} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-coffee/10 px-3 py-2 text-sm font-semibold">
              <Plus size={16} aria-hidden />
              Nouveau
            </button>
          </div>
          <input type="hidden" name="id" value={editing.id} />
          <Field name="author" label="Auteur" value={editing.author} />
          <label className="mt-4 block">
            <span className="text-sm font-semibold">Avis</span>
            <textarea name="quote" value={editing.quote} onChange={(event) => setEditing({ ...editing, quote: event.target.value })} className="focus-ring mt-2 min-h-32 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" />
          </label>
          <Field name="context" label="Contexte" value={editing.context} />
          <Field name="sortOrder" label="Ordre" value={String(editing.sortOrder)} type="number" />
          <div className="mt-4 flex flex-wrap gap-5">
            <Check name="isFeatured" label="Mis en avant" checked={editing.isFeatured} />
            <Check name="isActive" label="Actif" checked={editing.isActive} />
          </div>
          <button disabled={pending} className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-coffee px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream">
            <Save size={17} aria-hidden />
            Enregistrer
          </button>
        </form>

        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article key={testimonial.id} className="rounded-lg bg-cream p-5 shadow-admin">
              <p className="font-display text-2xl font-semibold text-coffee">{testimonial.author}</p>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-coffee/65">{testimonial.quote}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-terracotta">
                {testimonial.isActive ? "Actif" : "Inactif"}{testimonial.isFeatured ? " · En avant" : ""} · #{testimonial.sortOrder}
              </p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => setEditing({ ...testimonial, context: testimonial.context ?? "" })} className="focus-ring flex-1 rounded-lg border border-coffee/10 px-3 py-2 text-sm font-semibold">Modifier</button>
                <button type="button" onClick={() => remove(testimonial.id)} className="focus-ring rounded-lg border border-terracotta/20 px-3 py-2 text-terracotta">
                  <Trash2 size={16} aria-hidden />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );

  function Field({ name, label, value, type = "text" }: { name: string; label: string; value: string; type?: string }) {
    return (
      <label className="mt-4 block">
        <span className="text-sm font-semibold">{label}</span>
        <input name={name} value={value} onChange={(event) => setEditing({ ...editing, [name]: event.target.value })} type={type} min={type === "number" ? 0 : undefined} className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" />
      </label>
    );
  }
}

function Check({ name, label, checked }: { name: string; label: string; checked: boolean }) {
  return (
    <label className="flex items-center gap-3 text-sm font-semibold">
      <input name={name} type="checkbox" defaultChecked={checked} className="h-4 w-4 accent-terracotta" />
      {label}
    </label>
  );
}
