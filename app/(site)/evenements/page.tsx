import type { Metadata } from "next";
import EventCards from "@/components/site/EventCards";
import SiteChrome from "@/components/site/SiteChrome";
import type { EventServiceModel } from "@/lib/prisma-types";
import { getPublicEventsData } from "@/lib/public-data";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Événements privés | Restaurant Ali Baba El Jadida",
  description:
    "Organisez vos événements privés et repas de groupe au Restaurant Ali Baba El Jadida."
};

export default async function EventsPage() {
  const [settings, events] = await Promise.all([
    getSiteSettings(),
    getPublicEventsData()
  ]);

  return (
    <SiteChrome settings={settings}>
      <main>
        <section className="grain-overlay bg-[#10151e] px-5 py-20 text-center text-cream sm:py-24">
          <p className="eyebrow !text-sand">Groupes & événements</p>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-none sm:text-7xl">
            Un cadre prêt pour célébrer
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-cream/75">
            Familles, anniversaires, équipes et soirées privées : une organisation simple,
            une ambiance conviviale, un service attentif.
          </p>
        </section>
        <EventCards
          full
          events={events.map((event: EventServiceModel) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            imageUrl: event.imageUrl
          }))}
          settings={settings}
        />
      </main>
    </SiteChrome>
  );
}
