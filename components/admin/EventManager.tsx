"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { deleteEventAction, saveEventAction } from "@/app/admin/actions";
import Toast, { type ToastState } from "@/components/admin/Toast";
import { eventSchema, type EventInput } from "@/lib/validators";

type EventRow = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
};

const emptyEvent: EventInput = {
  title: "",
  description: "",
  imageUrl: "",
  isActive: true,
  sortOrder: 0
};

export default function EventManager({ events }: { events: EventRow[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, reset, formState } = useForm<EventInput>({
    resolver: zodResolver(eventSchema) as Resolver<EventInput>,
    defaultValues: emptyEvent
  });

  function createNew() {
    setEditing(null);
    setPreview(null);
    reset(emptyEvent);
  }

  function edit(event: EventRow) {
    setEditing(event.id);
    setPreview(event.imageUrl);
    reset({
      id: event.id,
      title: event.title,
      description: event.description,
      imageUrl: event.imageUrl ?? "",
      isActive: event.isActive,
      sortOrder: event.sortOrder
    });
  }

  function submit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    startTransition(async () => {
      const result = await saveEventAction(formData);
      setToast(result);
      if (result.ok) {
        createNew();
        router.refresh();
      }
    });
  }

  function remove(id: string) {
    if (!confirm("Supprimer ce service événementiel ?")) return;
    startTransition(async () => {
      const result = await deleteEventAction(id);
      setToast(result);
      router.refresh();
    });
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <form ref={formRef} onSubmit={handleSubmit(submit)} className="rounded-lg bg-cream p-6 shadow-admin" encType="multipart/form-data">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-coffee">{editing ? "Modifier" : "Ajouter"} un événement</h2>
            <button type="button" onClick={createNew} className="focus-ring inline-flex items-center gap-2 rounded-lg border border-coffee/10 px-3 py-2 text-sm font-semibold hover:bg-coffee/5">
              <Plus size={16} aria-hidden />
              Nouveau
            </button>
          </div>
          <input type="hidden" value={editing ?? ""} {...register("id")} name="id" />
          <input type="hidden" {...register("imageUrl")} name="imageUrl" />

          <label className="block">
            <span className="text-sm font-semibold">Titre</span>
            <input className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("title")} name="title" />
            {formState.errors.title ? <p className="mt-1 text-xs text-terracotta">{formState.errors.title.message}</p> : null}
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold">Description</span>
            <textarea className="focus-ring mt-2 min-h-32 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("description")} name="description" />
            {formState.errors.description ? <p className="mt-1 text-xs text-terracotta">{formState.errors.description.message}</p> : null}
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold">Ordre</span>
            <input type="number" min="0" className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("sortOrder", { valueAsNumber: true })} name="sortOrder" />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold">Image</span>
            <input type="file" name="imageFile" accept="image/*" className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 bg-white px-4 py-3 text-sm outline-none" />
          </label>
          <label className="mt-4 flex items-center gap-3 text-sm font-semibold">
            <input type="checkbox" className="h-4 w-4 accent-terracotta" {...register("isActive")} name="isActive" />
            Service actif
          </label>
          {preview ? <img src={preview} alt="" className="mt-5 h-44 w-full rounded-lg object-cover" /> : null}
          <button type="submit" disabled={pending} className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-coffee px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-terracotta disabled:opacity-60">
            <Save size={17} aria-hidden />
            {pending ? "Enregistrement..." : "Enregistrer l’événement"}
          </button>
        </form>

        <div className="grid gap-4 md:grid-cols-2">
          {events.length === 0 ? (
            <div className="rounded-lg bg-cream p-10 text-center text-coffee/55 shadow-admin md:col-span-2">Aucun événement configuré.</div>
          ) : events.map((event) => (
            <article key={event.id} className="overflow-hidden rounded-lg bg-cream shadow-admin">
              {event.imageUrl ? <img src={event.imageUrl} alt="" className="h-44 w-full object-cover" /> : <div className="h-44 bg-sand/40" />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-coffee">{event.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-terracotta">{event.isActive ? "Actif" : "Inactif"} • #{event.sortOrder}</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-coffee/60">{event.description}</p>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => edit(event)} className="focus-ring flex-1 rounded-lg border border-coffee/10 px-3 py-2 text-sm font-semibold hover:bg-coffee/5">Modifier</button>
                  <button type="button" onClick={() => remove(event.id)} className="focus-ring rounded-lg border border-terracotta/20 px-3 py-2 text-terracotta hover:bg-terracotta/10" aria-label="Supprimer">
                    <Trash2 size={16} aria-hidden />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
