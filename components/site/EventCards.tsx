import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Reveal from "@/components/site/Reveal";
import SectionIntro from "@/components/site/SectionIntro";
import type { SiteSettings } from "@/lib/settings";
import { createWhatsAppUrl } from "@/lib/whatsapp";

type EventItem = {
  id: string;
  title: string;
  description: string;
  type: string;
  capacity: string | null;
  imageUrl: string | null;
};

export default function EventCards({
  events,
  settings,
  full = false
}: {
  events: EventItem[];
  settings: SiteSettings;
  full?: boolean;
}) {
  const message =
    "Bonjour Restaurant Ali Baba, je souhaite réserver pour un groupe.\nDate :\nHeure :\nNombre de personnes :\nType d’événement :\nMessage :";
  const visible = full ? events : events.slice(0, 3);

  return (
    <section className="bg-[#11151e] py-24 text-cream sm:py-28">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <SectionIntro
            eyebrow="Groupes & événements"
            title="Des réservations adaptées aux moments qui comptent"
            text="Anniversaires, repas de famille, groupes ou privatisation partielle. Réponse rapide sur WhatsApp."
            light
          />
          <Reveal className="lg:justify-self-end">
            <a
              href={createWhatsAppUrl(settings.whatsapp, message)}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-lg bg-copper px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-terracotta"
            >
              <MessageCircle size={17} aria-hidden />
              Réserver un groupe
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((event, index) => (
            <Reveal key={event.id} delay={index * 0.05}>
              <article className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                <div className="relative h-56 bg-white/5">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                </div>
                <div className="p-5">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-sand">
                    {event.type}{event.capacity ? ` · ${event.capacity}` : ""}
                  </p>
                  <h3 className="font-display text-3xl font-semibold text-cream">{event.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-cream/75">{event.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
