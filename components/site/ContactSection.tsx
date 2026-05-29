import { Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
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
          eyebrow="Contact & réservation"
          title="Une table vous attend à El Jadida"
          text="Réservez en quelques secondes par WhatsApp ou appelez directement le restaurant."
          align="center"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg bg-coffee p-6 text-cream shadow-soft sm:p-8">
            <div className="space-y-5">
              <p className="flex gap-4"><MapPin className="mt-1 shrink-0 text-sand" size={22} aria-hidden /><span><strong className="block">Restaurant Ali Baba El Jadida</strong><span className="text-cream/70">{settings.address}</span></span></p>
              <p className="flex gap-4"><Phone className="mt-1 shrink-0 text-sand" size={22} aria-hidden /><span><a href={`tel:${settings.phone.replaceAll(".", "")}`} className="focus-ring block font-semibold hover:text-sand">Téléphone : {settings.phone}</a><a href={`tel:${settings.landline.replaceAll(".", "")}`} className="focus-ring mt-1 block text-cream/70 hover:text-sand">Téléphone fixe : {settings.landline}</a></span></p>
              <p className="flex gap-4"><Instagram className="mt-1 shrink-0 text-sand" size={22} aria-hidden /><a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="focus-ring font-semibold hover:text-sand">Instagram : {settings.instagram}</a></p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a href={`tel:${settings.phone.replaceAll(".", "")}`} className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-cream px-5 py-4 text-sm font-bold uppercase tracking-[0.14em] text-coffee transition hover:bg-sand">
                <Phone size={17} aria-hidden />
                Appeler
              </a>
              <a href={createWhatsAppUrl(settings.whatsapp, defaultReservationMessage)} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-terracotta px-5 py-4 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-copper">
                <MessageCircle size={17} aria-hidden />
                WhatsApp
              </a>
            </div>

            <div className="mt-8 rounded-lg border border-cream/10 bg-cream/10 p-5">
              <p className="font-display text-3xl font-semibold">Horaires</p>
              <p className="mt-2 leading-7 text-cream/70">{settings.hours}</p>
            </div>
          </div>

          <div className="grid gap-6">
            <ReservationWidget whatsapp={settings.whatsapp} />
            <div className="min-h-[360px] overflow-hidden rounded-lg shadow-soft">
              <iframe title="Localisation Restaurant Ali Baba El Jadida" src={mapsSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full min-h-[360px] w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
