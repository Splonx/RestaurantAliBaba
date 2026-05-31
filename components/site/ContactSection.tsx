import { Clock3, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import ReservationWidget from "@/components/site/ReservationWidget";
import SectionIntro from "@/components/site/SectionIntro";
import type { SiteSettings } from "@/lib/settings";
import { createWhatsAppUrl, defaultReservationMessage } from "@/lib/whatsapp";

export default function ContactSection({ settings }: { settings: SiteSettings }) {
  const mapsSrc =
    "https://www.google.com/maps?q=Route%20de%20Casablanca%20n%C2%B08%2C%20El%20Jadida%2C%20Morocco&output=embed";

  return (
    <section className="bg-ivory py-24 sm:py-28">
      <div className="section-shell">
        <SectionIntro
          eyebrow="Réserver"
          title="Passez de l’envie à la réservation en quelques secondes"
          text="Appel direct, WhatsApp rapide ou demande groupe : l’accès est pensé pour être immédiat."
          align="center"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-lg bg-[#11151e] p-6 text-cream shadow-soft sm:p-8">
            <div className="space-y-5 text-sm leading-7">
              <p className="flex gap-3">
                <MapPin className="mt-1 shrink-0 text-sand" size={18} aria-hidden />
                <span>{settings.address}</span>
              </p>
              <a
                href={`tel:${settings.phone.replaceAll(".", "")}`}
                className="focus-ring flex gap-3 transition hover:text-sand"
              >
                <Phone className="mt-1 shrink-0 text-sand" size={18} aria-hidden />
                <span>Téléphone : {settings.phone}</span>
              </a>
              <p className="flex gap-3">
                <Clock3 className="mt-1 shrink-0 text-sand" size={18} aria-hidden />
                <span>{settings.hours}</span>
              </p>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring flex gap-3 transition hover:text-sand"
              >
                <Instagram className="mt-1 shrink-0 text-sand" size={18} aria-hidden />
                <span>{settings.instagram}</span>
              </a>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a
                href={`tel:${settings.phone.replaceAll(".", "")}`}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] transition hover:border-sand hover:text-sand"
              >
                <Phone size={16} aria-hidden />
                Appeler
              </a>
              <a
                href={createWhatsAppUrl(settings.whatsapp, defaultReservationMessage)}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] transition hover:bg-terracotta"
              >
                <MessageCircle size={16} aria-hidden />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="grid gap-6">
            <ReservationWidget whatsapp={settings.whatsapp} />
            <div className="min-h-[360px] overflow-hidden rounded-lg border border-coffee/10 shadow-soft">
              <iframe
                title="Localisation Restaurant Ali Baba El Jadida"
                src={mapsSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[360px] w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
