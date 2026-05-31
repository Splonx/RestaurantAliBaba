import { CalendarClock, MessageCircle, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { createWhatsAppUrl, defaultReservationMessage } from "@/lib/whatsapp";

export default function FloatingActions({ settings }: { settings: SiteSettings }) {
  const quickMessage =
    "Bonjour Restaurant Ali Baba, je souhaite réserver une table aujourd’hui.\nNom :\nHeure :\nNombre de personnes :";

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <a
        href={createWhatsAppUrl(settings.whatsapp, quickMessage)}
        target="_blank"
        rel="noreferrer"
        className="focus-ring inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-4 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-xl shadow-black/30 transition hover:translate-y-[-1px]"
      >
        <CalendarClock size={16} aria-hidden />
        15s
      </a>
      <a
        href={createWhatsAppUrl(settings.whatsapp, defaultReservationMessage)}
        target="_blank"
        rel="noreferrer"
        className="focus-ring grid h-12 w-12 place-items-center rounded-full bg-copper text-cream shadow-xl shadow-black/30 transition hover:translate-y-[-1px]"
        aria-label="Réserver sur WhatsApp"
      >
        <MessageCircle size={21} aria-hidden />
      </a>
      <a
        href={`tel:${settings.phone.replaceAll(".", "")}`}
        className="focus-ring grid h-12 w-12 place-items-center rounded-full bg-[#131a24] text-sand shadow-xl shadow-black/30 transition hover:translate-y-[-1px]"
        aria-label="Appeler le restaurant"
      >
        <Phone size={20} aria-hidden />
      </a>
    </div>
  );
}
