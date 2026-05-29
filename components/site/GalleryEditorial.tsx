import { Instagram } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import SectionIntro from "@/components/site/SectionIntro";
import type { SiteSettings } from "@/lib/settings";

type GalleryItem = {
  id: string;
  title: string;
  imageUrl: string;
  alt: string;
  type: string;
  isFeatured: boolean;
};

export default function GalleryEditorial({
  images,
  settings,
  compact = false
}: {
  images: GalleryItem[];
  settings: SiteSettings;
  compact?: boolean;
}) {
  const visible = compact ? images.slice(0, 5) : images;

  return (
    <section className="bg-[#efe3d2] py-24 sm:py-28">
      <div className="section-shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="Galerie"
            title="Ambiance, plats et moments à partager"
            text="Une galerie éditoriale pour montrer l’expérience du restaurant : salle, assiettes, famille, groupes et atmosphère chaleureuse."
          />
          <Reveal>
            <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-coffee px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-terracotta">
              <Instagram size={17} aria-hidden />
              Instagram
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((image, index) => (
            <Reveal
              key={image.id}
              delay={index * 0.04}
              className={index === 0 ? "sm:col-span-2 sm:row-span-2" : index === 3 ? "lg:col-span-2" : ""}
            >
              <figure className="group relative h-full overflow-hidden rounded-lg bg-coffee shadow-soft">
                <img src={image.imageUrl} alt={image.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-coffee/80 via-coffee/10 to-transparent" />
                <figcaption className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-sand">{image.type}</p>
                  <h3 className="mt-1 font-display text-3xl font-semibold text-cream">{image.title}</h3>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
