"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { deleteCategoryAction, saveCategoryAction } from "@/app/admin/actions";
import Toast, { type ToastState } from "@/components/admin/Toast";
import { categorySchema, type CategoryInput } from "@/lib/validators";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

const emptyValues: CategoryInput = {
  name: "",
  slug: "",
  sortOrder: 0,
  isActive: true
};

export default function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, reset, formState } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema) as Resolver<CategoryInput>,
    defaultValues: emptyValues
  });

  function edit(category: CategoryRow) {
    setEditing(category.id);
    reset(category);
  }

  function createNew() {
    setEditing(null);
    reset(emptyValues);
  }

  function submit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    startTransition(async () => {
      const result = await saveCategoryAction(formData);
      setToast(result);
      if (result.ok) {
        createNew();
        router.refresh();
      }
    });
  }

  function remove(id: string) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    startTransition(async () => {
      const result = await deleteCategoryAction(id);
      setToast(result);
      router.refresh();
    });
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form ref={formRef} onSubmit={handleSubmit(submit)} className="rounded-lg bg-cream p-6 shadow-admin">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-coffee">
              {editing ? "Modifier" : "Ajouter"} une catégorie
            </h2>
            <button
              type="button"
              onClick={createNew}
              className="focus-ring inline-flex items-center gap-2 rounded-lg border border-coffee/10 px-3 py-2 text-sm font-semibold text-coffee hover:bg-coffee/5"
            >
              <Plus size={16} aria-hidden />
              Nouveau
            </button>
          </div>

          <input type="hidden" value={editing ?? ""} {...register("id")} name="id" />
          <label className="block">
            <span className="text-sm font-semibold">Nom</span>
            <input className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("name")} name="name" />
            {formState.errors.name ? <p className="mt-1 text-xs text-terracotta">{formState.errors.name.message}</p> : null}
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold">Slug</span>
            <input className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("slug")} name="slug" placeholder="auto si vide" />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold">Ordre</span>
            <input type="number" min="0" className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("sortOrder", { valueAsNumber: true })} name="sortOrder" />
          </label>
          <label className="mt-4 flex items-center gap-3 text-sm font-semibold">
            <input type="checkbox" className="h-4 w-4 accent-terracotta" {...register("isActive")} name="isActive" />
            Catégorie active
          </label>
          <button
            type="submit"
            disabled={pending}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-coffee px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-terracotta disabled:opacity-60"
          >
            <Save size={17} aria-hidden />
            {pending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>

        <div className="overflow-hidden rounded-lg bg-cream shadow-admin">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-coffee text-cream">
              <tr>
                <th className="px-5 py-4">Nom</th>
                <th className="px-5 py-4">Slug</th>
                <th className="px-5 py-4">Ordre</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-coffee/55">Aucune catégorie pour le moment.</td></tr>
              ) : categories.map((category) => (
                <tr key={category.id} className="border-b border-coffee/10 last:border-0">
                  <td className="px-5 py-4 font-semibold">{category.name}</td>
                  <td className="px-5 py-4 text-coffee/60">{category.slug}</td>
                  <td className="px-5 py-4">{category.sortOrder}</td>
                  <td className="px-5 py-4">{category.isActive ? "Active" : "Inactive"}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => edit(category)} className="focus-ring rounded-lg border border-coffee/10 px-3 py-2 font-semibold hover:bg-coffee/5">Modifier</button>
                      <button type="button" onClick={() => remove(category.id)} className="focus-ring rounded-lg border border-terracotta/20 px-3 py-2 text-terracotta hover:bg-terracotta/10" aria-label="Supprimer">
                        <Trash2 size={16} aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
