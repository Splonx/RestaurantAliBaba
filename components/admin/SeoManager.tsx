"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { saveSeoPageAction } from "@/app/admin/actions";
import Toast, { type ToastState } from "@/components/admin/Toast";

type SeoRow = {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords: string | null;
  ogImage: string | null;
  slug: string | null;
};

const paths = ["/", "/menu", "/galerie", "/evenements", "/a-propos", "/contact", "/reservation"];

export default function SeoManager({ pages }: { pages: SeoRow[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedPath, setSelectedPath] = useState(paths[0]);
  const selected = pages.find((page) => page.path === selectedPath);
  const [toast, setToast] = useState<ToastState>(null);
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    startTransition(async () => {
      const result = await saveSeoPageAction(formData);
      setToast(result);
      if (result.ok) router.refresh();
    });
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-lg bg-cream p-4 shadow-admin">
          {paths.map((path) => (
            <button
              key={path}
              type="button"
              onClick={() => setSelectedPath(path)}
              className={`focus-ring mb-2 block w-full rounded-lg px-4 py-3 text-left text-sm font-semibold ${
                selectedPath === path ? "bg-coffee text-cream" : "bg-white text-coffee hover:bg-coffee/5"
              }`}
            >
              {path}
            </button>
          ))}
        </div>

        <form key={selectedPath} ref={formRef} action={submit} className="rounded-lg bg-cream p-6 shadow-admin">
          <input type="hidden" name="id" defaultValue={selected?.id ?? ""} />
          <input type="hidden" name="path" value={selectedPath} />
          <Field name="title" label="Title SEO" value={selected?.title ?? `Restaurant Ali Baba El Jadida | ${selectedPath}`} />
          <label className="mt-4 block">
            <span className="text-sm font-semibold">Meta description</span>
            <textarea name="description" defaultValue={selected?.description ?? ""} className="focus-ring mt-2 min-h-28 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" />
          </label>
          <Field name="keywords" label="Keywords" value={selected?.keywords ?? ""} />
          <Field name="ogImage" label="Open Graph image" value={selected?.ogImage ?? ""} />
          <Field name="slug" label="Slug canonique" value={selected?.slug ?? selectedPath} />
          <button disabled={pending} className="focus-ring mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-coffee px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream">
            <Save size={17} aria-hidden />
            Enregistrer le SEO
          </button>
        </form>
      </div>
    </>
  );
}

function Field({ name, label, value }: { name: string; label: string; value: string }) {
  return (
    <label className="mt-4 block first:mt-0">
      <span className="text-sm font-semibold">{label}</span>
      <input name={name} defaultValue={value} className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none" />
    </label>
  );
}
