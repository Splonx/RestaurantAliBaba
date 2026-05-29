"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { deleteGalleryImageAction, saveGalleryImageAction } from "@/app/admin/actions";
import Toast, { type ToastState } from "@/components/admin/Toast";
import { gallerySchema, type GalleryInput } from "@/lib/validators";

type GalleryRow = {
  id: string;
  title: string;
  imageUrl: string;
  alt: string;
  type: "plat" | "salle" | "événement" | "ambiance";
  isFeatured: boolean;
  sortOrder: number;
};

const emptyGallery: GalleryInput = {
  title: "",
  imageUrl: "",
  alt: "",
  type: "plat",
  isFeatured: false,
  sortOrder: 0
};

export default function GalleryManager({ images }: { images: GalleryRow[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, reset, formState } = useForm<GalleryInput>({
    resolver: zodResolver(gallerySchema) as Resolver<GalleryInput>,
    defaultValues: emptyGallery
  });

  function createNew() {
    setEditing(null);
    setPreview(null);
    reset(emptyGallery);
  }

  function edit(image: GalleryRow) {
    setEditing(image.id);
    setPreview(image.imageUrl);
    reset(image);
  }

  function submit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    startTransition(async () => {
      const result = await saveGalleryImageAction(formData);
      setToast(result);
      if (result.ok) {
        createNew();
        router.refresh();
      }
    });
  }

  function remove(id: string) {
    if (!confirm("Supprimer cette image ?")) return;
    startTransition(async () => {
      const result = await deleteGalleryImageAction(id);
      setToast(result);
      router.refresh();
    });
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form ref={formRef} onSubmit={handleSubmit(submit)} className="rounded-lg bg-cream p-6 shadow-admin" encType="multipart/form-data">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-coffee">{editing ? "Modifier" : "Ajouter"} une image</h2>
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
            <span className="text-sm font-semibold">Texte alternatif</span>
            <input className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("alt")} name="alt" />
            {formState.errors.alt ? <p className="mt-1 text-xs text-terracotta">{formState.errors.alt.message}</p> : null}
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold">Type</span>
            <select className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("type")} name="type">
              <option value="plat">Plat</option>
              <option value="salle">Salle</option>
              <option value="événement">Événement</option>
              <option value="ambiance">Ambiance</option>
            </select>
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
            <input type="checkbox" className="h-4 w-4 accent-terracotta" {...register("isFeatured")} name="isFeatured" />
            Image mise en avant
          </label>
          {preview ? <img src={preview} alt="" className="mt-5 h-44 w-full rounded-lg object-cover" /> : null}
          <button type="submit" disabled={pending} className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-coffee px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-terracotta disabled:opacity-60">
            <Save size={17} aria-hidden />
            {pending ? "Enregistrement..." : "Enregistrer l’image"}
          </button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2">
          {images.length === 0 ? (
            <div className="rounded-lg bg-cream p-10 text-center text-coffee/55 shadow-admin sm:col-span-2">Aucune image dans la galerie.</div>
          ) : images.map((image) => (
            <article key={image.id} className="overflow-hidden rounded-lg bg-cream shadow-admin">
              <img src={image.imageUrl} alt={image.alt} className="h-48 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-coffee">{image.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-terracotta">{image.type}{image.isFeatured ? " • En avant" : ""}</p>
                  </div>
                  <span className="text-sm text-coffee/55">#{image.sortOrder}</span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-coffee/60">{image.alt}</p>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => edit(image)} className="focus-ring flex-1 rounded-lg border border-coffee/10 px-3 py-2 text-sm font-semibold hover:bg-coffee/5">Modifier</button>
                  <button type="button" onClick={() => remove(image.id)} className="focus-ring rounded-lg border border-terracotta/20 px-3 py-2 text-terracotta hover:bg-terracotta/10" aria-label="Supprimer">
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
