import EventManager from "@/components/admin/EventManager";
import PageHeader from "@/components/admin/PageHeader";
import { prisma } from "@/lib/prisma";
import type { EventServiceModel } from "@/lib/prisma-types";

export default async function AdminEventsPage() {
  const events: EventServiceModel[] = await prisma.eventService.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });

  return (
    <>
      <PageHeader
        title="Événements"
        text="Administrez les offres pour anniversaires, groupes, soirées privées, familles et déjeuners professionnels."
      />
      <EventManager
        events={events.map((event: EventServiceModel) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          imageUrl: event.imageUrl,
          isActive: event.isActive,
          sortOrder: event.sortOrder
        }))}
      />
    </>
  );
}
