import { CalendarClock, MessageCircle, Users } from "lucide-react";
import type { ReactNode } from "react";
import ReservationWidget from "@/components/site/ReservationWidget";
import SiteChrome from "@/components/site/SiteChrome";
import { metadataForPath } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

export const generateMetadata = () => metadataForPath("/reservation");

export default async function ReservationPage() {
  const settings = await getSiteSettings();

  return (
    <SiteChrome settings={settings}>
      <main>
        <section className="grain-overlay bg-[#10151e] text-cream">
          <div className="section-shell grid min-h-[calc(100vh-5rem)] gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-16">
            <div>
              <p className="eyebrow !text-sand">Réservation</p>
              <h1 className="mt-3 max-w-3xl font-display text-6xl font-semibold leading-none sm:text-7xl">
                Votre table à Ali Baba
              </h1>
              <p className="mt-5 max-w-2xl leading-8 text-cream/75">
                Demande de table, repas de groupe ou événement privé : laissez vos coordonnées,
                l’équipe vous confirme rapidement.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <ReservationPoint
                  icon={<CalendarClock size={21} aria-hidden />}
                  title="Aujourd’hui"
                  text="Réservation rapide par WhatsApp."
                />
                <ReservationPoint
                  icon={<Users size={21} aria-hidden />}
                  title="Groupes"
                  text="Repas famille, entreprise ou événement privé."
                />
                <ReservationPoint
                  icon={<MessageCircle size={21} aria-hidden />}
                  title="Confirmation"
                  text="L’équipe confirme votre demande."
                />
              </div>
            </div>

            <ReservationWidget whatsapp={settings.whatsapp} />
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}

function ReservationPoint({
  icon,
  title,
  text
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="text-sand">{icon}</div>
      <h2 className="mt-3 font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-cream/65">{text}</p>
    </article>
  );
}
