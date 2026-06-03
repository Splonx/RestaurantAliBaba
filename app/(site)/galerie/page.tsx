import GalleryEditorial from "@/components/site/GalleryEditorial";
import SiteChrome from "@/components/site/SiteChrome";
import type { GalleryImageModel } from "@/lib/prisma-types";
import { getPublicGalleryData } from "@/lib/public-data";
import { metadataForPath } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

export const generateMetadata = () => metadataForPath("/galerie");

export default async function GalleryPage() {
  const [settings, images] = await Promise.all([
    getSiteSettings(),
    getPublicGalleryData()
  ]);

  return (
    <SiteChrome settings={settings}>
      <main>
        <section className="grain-overlay bg-[#10151e] px-5 py-20 text-center text-cream sm:py-24">
          <p className="eyebrow !text-sand">Galerie immersive</p>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-none sm:text-7xl">
            Salle, assiettes, moments
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-cream/75">
            Une narration visuelle inspirée de l’univers réel du restaurant et de son identité en ligne.
          </p>
        </section>
        <GalleryEditorial
          images={images.map((image: GalleryImageModel) => ({
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
