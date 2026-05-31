import type { Metadata } from "next";
import ContactSection from "@/components/site/ContactSection";
import EventCards from "@/components/site/EventCards";
import GalleryEditorial from "@/components/site/GalleryEditorial";
import Hero from "@/components/site/Hero";
import MenuShowcase from "@/components/site/MenuShowcase";
import SiteChrome from "@/components/site/SiteChrome";
import SpecialtiesBand from "@/components/site/SpecialtiesBand";
import StorySection from "@/components/site/StorySection";
import type {
  DishWithCategory,
  EventServiceModel,
  GalleryImageModel
} from "@/lib/prisma-types";
import { getPublicHomeData } from "@/lib/public-data";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Ali Baba El Jadida | Poissons, grillades et cuisine marocaine",
  description:
    "Restaurant Ali Baba El Jadida : ambiance chaleureuse, poissons, grillades, cuisine marocaine et réservations groupe."
};

export default async function HomePage() {
  const [settings, homeData] = await Promise.all([getSiteSettings(), getPublicHomeData()]);

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
    sameAs: [settings.instagramUrl]
  };

  return (
    <SiteChrome settings={settings}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <Hero settings={settings} imageUrl={homeData.gallery[0]?.imageUrl} />
        <StorySection settings={settings} />
        <SpecialtiesBand />
        <MenuShowcase
          dishes={homeData.dishes.map((dish: DishWithCategory) => ({
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
          images={homeData.gallery.map((image: GalleryImageModel) => ({
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
          events={homeData.events.map((event: EventServiceModel) => ({
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
