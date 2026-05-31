"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { deleteDishAction, saveDishAction } from "@/app/admin/actions";
import Toast, { type ToastState } from "@/components/admin/Toast";
import { dishSchema, type DishInput } from "@/lib/validators";

type CategoryOption = {
  id: string;
  name: string;
};

type DishRow = {
  id: string;
  name: string;
  description: string;
  price: string | null;
  imageUrl: string | null;
  categoryId: string;
  categoryName: string;
  badge: string | null;
  isActive: boolean;
  sortOrder: number;
};

const emptyDish: DishInput = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  categoryId: "",
  badge: "",
  isActive: true,
  sortOrder: 0
};

export default function MenuManager({
  dishes,
  categories
}: {
  dishes: DishRow[];
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, reset, formState } = useForm<DishInput>({
    resolver: zodResolver(dishSchema) as Resolver<DishInput>,
    defaultValues: emptyDish
  });

  function createNew() {
    setEditing(null);
    setPreview(null);
    reset(emptyDish);
  }

  function edit(dish: DishRow) {
    setEditing(dish.id);
    setPreview(dish.imageUrl);
    reset({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price ?? "",
      imageUrl: dish.imageUrl ?? "",
      categoryId: dish.categoryId,
      badge: (dish.badge as DishInput["badge"]) ?? "",
      isActive: dish.isActive,
      sortOrder: dish.sortOrder
    });
  }

  function submit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    startTransition(async () => {
      const result = await saveDishAction(formData);
      setToast(result);
      if (result.ok) {
        createNew();
        router.refresh();
      }
    });
  }

  function remove(id: string) {
    if (!confirm("Supprimer ce plat ?")) return;
    startTransition(async () => {
      const result = await deleteDishAction(id);
      setToast(result);
      router.refresh();
    });
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="grid gap-6 2xl:grid-cols-[0.78fr_1.22fr]">
        <form
          ref={formRef}
          onSubmit={handleSubmit(submit)}
          className="rounded-lg bg-cream p-6 shadow-admin"
          encType="multipart/form-data"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-coffee">
              {editing ? "Modifier" : "Ajouter"} un plat
            </h2>
            <button
              type="button"
              onClick={createNew}
              className="focus-ring inline-flex items-center gap-2 rounded-lg border border-coffee/10 px-3 py-2 text-sm font-semibold hover:bg-coffee/5"
            >
              <Plus size={16} aria-hidden />
              Nouveau
            </button>
          </div>

          <input type="hidden" value={editing ?? ""} {...register("id")} name="id" />
          <input type="hidden" {...register("imageUrl")} name="imageUrl" />

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-1">
            <label className="block">
              <span className="text-sm font-semibold">Nom</span>
              <input className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("name")} name="name" />
              {formState.errors.name ? <p className="mt-1 text-xs text-terracotta">{formState.errors.name.message}</p> : null}
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Catégorie</span>
              <select className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("categoryId")} name="categoryId">
                <option value="">Choisir</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {formState.errors.categoryId ? <p className="mt-1 text-xs text-terracotta">{formState.errors.categoryId.message}</p> : null}
            </label>
            <label className="block md:col-span-2 2xl:col-span-1">
              <span className="text-sm font-semibold">Description</span>
              <textarea className="focus-ring mt-2 min-h-28 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("description")} name="description" />
              {formState.errors.description ? <p className="mt-1 text-xs text-terracotta">{formState.errors.description.message}</p> : null}
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Prix</span>
              <input className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("price")} name="price" placeholder="Disponible au restaurant si vide" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Badge</span>
              <select className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("badge")} name="badge">
                <option value="">Aucun</option>
                <option value="populaire">Populaire</option>
                <option value="recommandé">Recommandé</option>
                <option value="nouveau">Nouveau</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Ordre</span>
              <input type="number" min="0" className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" {...register("sortOrder", { valueAsNumber: true })} name="sortOrder" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Image</span>
              <input type="file" name="imageFile" accept="image/*" className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 bg-white px-4 py-3 text-sm outline-none" />
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold">
              <input type="checkbox" className="h-4 w-4 accent-terracotta" {...register("isActive")} name="isActive" />
              Plat actif
            </label>
          </div>

          {preview ? (
            <div className="mt-5 overflow-hidden rounded-lg border border-coffee/10">
              <img src={preview} alt="" className="h-40 w-full object-cover" />
            </div>
          ) : (
            <div className="mt-5 flex h-32 items-center justify-center rounded-lg border border-dashed border-coffee/20 text-sm text-coffee/50">
              <ImagePlus size={18} className="mr-2" aria-hidden />
              Image optionnelle
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-coffee px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-terracotta disabled:opacity-60"
          >
            <Save size={17} aria-hidden />
            {pending ? "Enregistrement..." : "Enregistrer le plat"}
          </button>
        </form>

        <div className="overflow-hidden rounded-lg bg-cream shadow-admin">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-coffee text-cream">
              <tr>
                <th className="px-5 py-4">Plat</th>
                <th className="px-5 py-4">Catégorie</th>
                <th className="px-5 py-4">Prix</th>
                <th className="px-5 py-4">Badge</th>
                <th className="px-5 py-4">Ordre</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dishes.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-coffee/55">Aucun plat. Ajoutez le premier élément de carte.</td></tr>
              ) : dishes.map((dish) => (
                <tr key={dish.id} className="border-b border-coffee/10 last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {dish.imageUrl ? <img src={dish.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover" /> : <div className="h-12 w-12 rounded-lg bg-sand/40" />}
                      <div>
                        <p className="font-semibold">{dish.name}</p>
                        <p className="line-clamp-1 max-w-xs text-xs text-coffee/55">{dish.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">{dish.categoryName}</td>
                  <td className="px-5 py-4">{dish.price || "Disponible au restaurant"}</td>
                  <td className="px-5 py-4">{dish.badge || "Aucun"}</td>
                  <td className="px-5 py-4">{dish.sortOrder}</td>
                  <td className="px-5 py-4">{dish.isActive ? "Actif" : "Inactif"}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => edit(dish)} className="focus-ring rounded-lg border border-coffee/10 px-3 py-2 font-semibold hover:bg-coffee/5">Modifier</button>
                      <button type="button" onClick={() => remove(dish.id)} className="focus-ring rounded-lg border border-terracotta/20 px-3 py-2 text-terracotta hover:bg-terracotta/10" aria-label="Supprimer">
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
