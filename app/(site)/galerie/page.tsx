import type { Metadata } from "next";
import GalleryEditorial from "@/components/site/GalleryEditorial";
import SiteChrome from "@/components/site/SiteChrome";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Galerie | Restaurant Ali Baba El Jadida",
  description:
    "Découvrez l’ambiance, les plats et les événements du Restaurant Ali Baba El Jadida en galerie."
};

export default async function GalleryPage() {
  const [settings, images] = await Promise.all([
    getSiteSettings(),
    prisma.galleryImage.findMany({
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
    })
  ]);

  return (
    <SiteChrome settings={settings}>
      <main>
        <section className="moroccan-pattern bg-coffee px-5 py-20 text-center text-cream sm:py-24">
          <p className="eyebrow">Galerie</p>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-none sm:text-7xl">
            Ambiance & assiettes
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-cream/70">
            Une sélection de visuels modifiables depuis le back-office : plats, salle,
            événements et atmosphère du restaurant.
          </p>
        </section>
        <GalleryEditorial
          images={images.map((image) => ({
            id: image.id,
            title: image.title,
            imageUrl: image.imageUrl,
            alt: image.alt,
            type: image.type,
            isFeatured: image.isFeatured
          }))}
          settings={settings}
        />
      </main>
    </SiteChrome>
  );
}
