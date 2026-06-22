"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="focus-ring mt-8 rounded-lg bg-[#B95C3C] px-5 py-3 text-sm font-bold text-[#F7F1E8] print:hidden"
    >
      Imprimer
    </button>
  );
}
