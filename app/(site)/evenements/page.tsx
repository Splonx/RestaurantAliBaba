import type { Metadata } from "next";
import EventCards from "@/components/site/EventCards";
import SiteChrome from "@/components/site/SiteChrome";
import { prisma } from "@/lib/prisma";
import type { EventServiceModel } from "@/lib/prisma-types";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Événements privés | Restaurant Ali Baba El Jadida",
  description:
    "Organisez anniversaires, repas de groupe, familles, soirées privées et déjeuners professionnels au Restaurant Ali Baba El Jadida."
};

export default async function EventsPage() {
  const eventsQuery: Promise<EventServiceModel[]> = prisma.eventService.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });
  const [settings, events] = await Promise.all([
    getSiteSettings(),
    eventsQuery
  ]);

  return (
    <SiteChrome settings={settings}>
      <main>
        <section className="moroccan-pattern bg-coffee px-5 py-20 text-center text-cream sm:py-24">
          <p className="eyebrow">Groupes & événements</p>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-none sm:text-7xl">
            Réunir autour d’une belle table
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-cream/70">
            Restaurant événement El Jadida pour familles, groupes, anniversaires,
            soirées privées et repas professionnels.
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
