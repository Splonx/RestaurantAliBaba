"use client";

import { ImagePlus, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveBrandAssetAction } from "@/app/admin/actions";
import Toast, { type ToastState } from "@/components/admin/Toast";

type BrandAssetRow = {
  id: string;
  key: string;
  label: string;
  value: string;
  type: "text" | "color" | "image" | "url";
};

const defaults: BrandAssetRow[] = [
  { id: "", key: "logo", label: "Logo principal", value: "AB", type: "text" },
  { id: "", key: "favicon", label: "Favicon", value: "/favicon.ico", type: "url" },
  { id: "", key: "heroImage", label: "Image hero", value: "", type: "image" },
  { id: "", key: "primaryColor", label: "Couleur principale", value: "#B95C3C", type: "color" },
  { id: "", key: "secondaryColor", label: "Couleur secondaire", value: "#4F5B3A", type: "color" }
];

export default function BrandingManager({ assets }: { assets: BrandAssetRow[] }) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState>(null);
  const [pending, startTransition] = useTransition();
  const merged = defaults.map((item) => assets.find((asset) => asset.key === item.key) ?? item);

  function submit(formData: FormData) {
    startTransition(async () => {
      const result = await saveBrandAssetAction(formData);
      setToast(result);
      if (result.ok) router.refresh();
    });
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="grid gap-5 xl:grid-cols-2">
        {merged.map((asset) => (
          <form key={asset.key} action={submit} className="rounded-lg bg-cream p-5 shadow-admin" encType="multipart/form-data">
            <input type="hidden" name="id" value={asset.id} />
            <input type="hidden" name="key" value={asset.key} />
            <input type="hidden" name="type" value={asset.type} />
            <label className="block">
              <span className="text-sm font-semibold">Libellé</span>
              <input name="label" defaultValue={asset.label} className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" />
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-semibold">Valeur</span>
              <input name="value" defaultValue={asset.value} type={asset.type === "color" ? "color" : "text"} className="focus-ring mt-2 h-12 w-full rounded-lg border border-coffee/10 px-4 py-2 outline-none" />
            </label>
            {asset.type === "image" ? (
              <label className="mt-4 block">
                <span className="text-sm font-semibold">Upload image</span>
                <input type="file" name="imageFile" accept="image/*" className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 bg-white px-4 py-3 text-sm outline-none" />
              </label>
            ) : null}
            {asset.type === "image" && asset.value ? (
              <img src={asset.value} alt="" className="mt-4 h-36 w-full rounded-lg object-cover" />
            ) : (
              <div className="mt-4 flex h-20 items-center justify-center rounded-lg bg-white text-sm text-coffee/50">
                <ImagePlus size={17} className="mr-2" aria-hidden />
                {asset.key}
              </div>
            )}
            <button disabled={pending} className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-coffee px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream">
              <Save size={17} aria-hidden />
              Enregistrer
            </button>
          </form>
        ))}
      </div>
    </>
  );
}
