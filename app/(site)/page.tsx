import ContactSection from "@/components/site/ContactSection";
import EventCards from "@/components/site/EventCards";
import GalleryEditorial from "@/components/site/GalleryEditorial";
import Hero from "@/components/site/Hero";
import MenuShowcase from "@/components/site/MenuShowcase";
import SiteChrome from "@/components/site/SiteChrome";
import SpecialtiesBand from "@/components/site/SpecialtiesBand";
import StorySection from "@/components/site/StorySection";
import TestimonialStrip from "@/components/site/TestimonialStrip";
import type {
  DishWithCategory,
  EventServiceModel,
  GalleryImageModel
} from "@/lib/prisma-types";
import { getBrandAssetValue, getPublicHomeData } from "@/lib/public-data";
import { metadataForPath } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

export const generateMetadata = () => metadataForPath("/");

export default async function HomePage() {
  const [settings, homeData] = await Promise.all([getSiteSettings(), getPublicHomeData()]);
  const heroImage = getBrandAssetValue(
    homeData.brandAssets,
    "heroImage",
    homeData.gallery[0]?.imageUrl
  );

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
        <Hero settings={settings} imageUrl={heroImage} />
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
            allergens: dish.allergens,
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
            type: event.type,
            capacity: event.capacity,
            imageUrl: event.imageUrl
          }))}
          settings={settings}
        />
        <TestimonialStrip
          testimonials={homeData.testimonials.map((testimonial) => ({
            id: testimonial.id,
            author: testimonial.author,
            quote: testimonial.quote,
            context: testimonial.context
          }))}
        />
        <ContactSection settings={settings} />
      </main>
    </SiteChrome>
  );
}
