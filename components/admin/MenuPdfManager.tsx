"use client";

import { Copy, Download, FileText, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { saveMenuDocumentAction } from "@/app/admin/actions";
import Toast, { type ToastState } from "@/components/admin/Toast";

type MenuPdfManagerProps = {
  title: string;
  fileUrl: string;
  publicFileUrl: string;
  menuUrl: string;
  qrCode: string;
};

export default function MenuPdfManager({
  title,
  fileUrl,
  publicFileUrl,
  menuUrl,
  qrCode
}: MenuPdfManagerProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [copied, setCopied] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    startTransition(async () => {
      const result = await saveMenuDocumentAction(formData);
      setToast(result);
      if (result.ok) router.refresh();
    });
  }

  async function copy(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1800);
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form
          ref={formRef}
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          encType="multipart/form-data"
          className="rounded-lg bg-cream p-6 shadow-admin"
        >
          <div className="flex items-center gap-3">
            <FileText className="text-terracotta" size={24} aria-hidden />
            <h2 className="font-display text-3xl font-semibold text-coffee">
              PDF actuel
            </h2>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-semibold">Titre</span>
            <input
              name="title"
              defaultValue={title}
              className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold">URL publique</span>
            <input
              name="fileUrl"
              defaultValue={fileUrl}
              className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 px-4 py-3 outline-none"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold">Remplacer le PDF</span>
            <input
              type="file"
              name="menuPdf"
              accept="application/pdf"
              className="focus-ring mt-2 w-full rounded-lg border border-coffee/10 bg-white px-4 py-3 text-sm outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={pending}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-coffee px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-terracotta disabled:opacity-60"
          >
            <Save size={17} aria-hidden />
            {pending ? "Enregistrement..." : "Enregistrer le PDF"}
          </button>
        </form>

        <section className="rounded-lg bg-cream p-6 shadow-admin">
          <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
            <div>
              <p className="eyebrow">Lien public</p>
              <h3 className="mt-2 font-display text-3xl font-semibold text-coffee">
                Menu PDF & QR code
              </h3>
              <div className="mt-5 grid gap-3">
                <a
                  href={publicFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring rounded-lg bg-terracotta px-4 py-3 text-center text-sm font-bold text-cream"
                >
                  Voir le PDF public
                </a>
                <button
                  type="button"
                  onClick={() => copy(publicFileUrl, "pdf")}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-coffee/10 bg-white px-4 py-3 text-sm font-bold text-coffee"
                >
                  <Copy size={17} aria-hidden />
                  {copied === "pdf" ? "Lien copié" : "Copier le lien PDF"}
                </button>
                <button
                  type="button"
                  onClick={() => copy(menuUrl, "menu")}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-coffee/10 bg-white px-4 py-3 text-sm font-bold text-coffee"
                >
                  <Copy size={17} aria-hidden />
                  {copied === "menu" ? "Lien copié" : "Copier le lien menu"}
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 text-center">
              <img src={qrCode} alt="QR code vers le menu" className="mx-auto h-44 w-44" />
              <a
                href={qrCode}
                download="qr-menu-restaurant-ali-baba.png"
                className="focus-ring mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-olive px-4 py-3 text-sm font-bold text-cream"
              >
                <Download size={17} aria-hidden />
                Télécharger QR
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
