import type { Metadata } from "next";
import ContactSection from "@/components/site/ContactSection";
import EventCards from "@/components/site/EventCards";
import GalleryEditorial from "@/components/site/GalleryEditorial";
import Hero from "@/components/site/Hero";
import MenuShowcase from "@/components/site/MenuShowcase";
import SiteChrome from "@/components/site/SiteChrome";
import SpecialtiesBand from "@/components/site/SpecialtiesBand";
import StorySection from "@/components/site/StorySection";
import { prisma } from "@/lib/prisma";
import type {
  DishWithCategory,
  EventServiceModel,
  GalleryImageModel
} from "@/lib/prisma-types";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Restaurant Ali Baba El Jadida | Cuisine marocaine & méditerranéenne",
  description:
    "Découvrez Restaurant Ali Baba à El Jadida : cuisine marocaine et méditerranéenne, poissons, grillades, repas en famille, groupes et événements privés."
};

export default async function HomePage() {
  const dishesQuery: Promise<DishWithCategory[]> = prisma.dish.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: [{ badge: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    take: 8
  });
  const galleryQuery: Promise<GalleryImageModel[]> = prisma.galleryImage.findMany({
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
  });
  const eventsQuery: Promise<EventServiceModel[]> = prisma.eventService.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });

  const [settings, dishes, gallery, events] = await Promise.all([
    getSiteSettings(),
    dishesQuery,
    galleryQuery,
    eventsQuery
  ]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Restaurant Ali Baba El Jadida",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "El Jadida",
      addressCountry: "MA"
    },
    telephone: [settings.phone, settings.landline],
    servesCuisine: ["Marocaine", "Méditerranéenne", "Poissons", "Grillades"],
    sameAs: [settings.instagramUrl],
    priceRange: "$$"
  };

  return (
    <SiteChrome settings={settings}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <Hero settings={settings} imageUrl={gallery[0]?.imageUrl} />
        <StorySection settings={settings} />
        <SpecialtiesBand />
        <MenuShowcase
          dishes={dishes.map((dish: DishWithCategory) => ({
            id: dish.id,
            name: dish.name,
            description: dish.description,
            price: dish.price,
            imageUrl: dish.imageUrl,
            badge: dish.badge,
            categoryName: dish.category.name
          }))}
        />
        <GalleryEditorial
          compact
          images={gallery.map((image: GalleryImageModel) => ({
            id: image.id,
            title: image.title,
            imageUrl: image.imageUrl,
            alt: image.alt,
            type: image.type,
            isFeatured: image.isFeatured
          }))}
          settings={settings}
        />
        <EventCards
          events={events.map((event: EventServiceModel) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            imageUrl: event.imageUrl
          }))}
          settings={settings}
        />
        <ContactSection settings={settings} />
      </main>
    </SiteChrome>
  );
}
