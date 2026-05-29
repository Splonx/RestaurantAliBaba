import { MessageCircle } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import SectionIntro from "@/components/site/SectionIntro";
import type { SiteSettings } from "@/lib/settings";
import { createWhatsAppUrl } from "@/lib/whatsapp";

type EventItem = {
  id: string;
  title: string;
  description: string;
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
    "Bonjour Restaurant Ali Baba, je souhaite demander une réservation de groupe.\nDate :\nHeure :\nNombre de personnes :\nOccasion :\nMessage :";

  return (
    <section className="bg-coffee py-24 text-cream sm:py-28">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <SectionIntro
            eyebrow="Événements privés"
            title="Recevoir avec chaleur, simplicité et élégance"
            text="Anniversaires, familles, groupes, soirées privées ou déjeuners professionnels : le restaurant devient un cadre accueillant pour vos moments importants."
            light
          />
          <Reveal className="lg:justify-self-end">
            <a href={createWhatsAppUrl(settings.whatsapp, message)} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-terracotta px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-copper">
              <MessageCircle size={17} aria-hidden />
              Réservation de groupe
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(full ? events : events.slice(0, 5)).map((event, index) => (
            <Reveal key={event.id} delay={index * 0.05}>
              <article className="overflow-hidden rounded-lg border border-cream/10 bg-cream/10">
                <div className="h-52 bg-sand/20">
                  {event.imageUrl ? <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" /> : null}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-3xl font-semibold text-cream">{event.title}</h3>
                  <p className="mt-3 leading-7 text-cream/70">{event.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
