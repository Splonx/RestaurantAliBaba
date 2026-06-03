"use client";

import { Instagram } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
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
  const filters = useMemo(() => ["Tout", ...Array.from(new Set(images.map((image) => image.type)))], [images]);
  const [activeFilter, setActiveFilter] = useState("Tout");
  const filteredImages =
    activeFilter === "Tout" ? images : images.filter((image) => image.type === activeFilter);
  const visible = compact ? filteredImages.slice(0, 6) : filteredImages;

  return (
    <section className="bg-[#0f141c] py-24 text-cream sm:py-28">
      <div className="section-shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="Galerie immersive"
            title="L’expérience en images, pas en simple grille"
            text="Salle, assiettes, service et ambiance : chaque photo doit donner envie de réserver."
            light
          />
          <Reveal>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:border-sand hover:text-sand"
            >
              <Instagram size={17} aria-hidden />
              Voir Instagram
            </a>
          </Reveal>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2 lg:justify-start">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`focus-ring rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
                activeFilter === filter
                  ? "border-sand bg-sand text-coffee"
                  : "border-white/15 bg-white/[0.04] text-cream/80 hover:border-sand hover:text-sand"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 xl:columns-3">
          {visible.map((image, index) => (
            <Reveal key={image.id} delay={index * 0.03} className="mb-4 break-inside-avoid">
              <figure className="group overflow-hidden rounded-lg border border-white/10 bg-black/30">
                <div className={`relative ${index % 3 === 0 ? "h-[420px]" : index % 3 === 1 ? "h-[300px]" : "h-[360px]"}`}>
                  <Image
                    src={image.imageUrl}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <figcaption className="absolute bottom-3 left-3 right-3">
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-sand">
                      {image.type}
                    </p>
                    <h3 className="mt-1 font-display text-3xl font-semibold text-cream">{image.title}</h3>
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
