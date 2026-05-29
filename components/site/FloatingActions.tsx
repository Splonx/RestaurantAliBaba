import { MessageCircle, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { createWhatsAppUrl, defaultReservationMessage } from "@/lib/whatsapp";

export default function FloatingActions({ settings }: { settings: SiteSettings }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      <a href={createWhatsAppUrl(settings.whatsapp, defaultReservationMessage)} target="_blank" rel="noreferrer" className="focus-ring grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-coffee/20 transition hover:scale-105" aria-label="Réserver sur WhatsApp">
        <MessageCircle size={25} aria-hidden />
      </a>
      <a href={`tel:${settings.phone.replaceAll(".", "")}`} className="focus-ring grid h-14 w-14 place-items-center rounded-full bg-coffee text-sand shadow-lg shadow-coffee/20 transition hover:scale-105 md:hidden" aria-label="Appeler le restaurant">
        <Phone size={22} aria-hidden />
      </a>
    </div>
  );
}
