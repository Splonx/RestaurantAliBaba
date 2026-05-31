import { HeartHandshake, Sparkles, UsersRound, Waves } from "lucide-react";
import Image from "next/image";
import Reveal from "@/components/site/Reveal";
import SectionIntro from "@/components/site/SectionIntro";
import type { SiteSettings } from "@/lib/settings";

const pillars = [
  {
    title: "Convivialité réelle",
    text: "Un service attentif, pensé pour les couples, familles et grandes tablées.",
    icon: UsersRound
  },
  {
    title: "Cuisine généreuse",
    text: "Poissons, grillades, inspirations marocaines et méditerranéennes.",
    icon: HeartHandshake
  },
  {
    title: "Cadre bord de mer",
    text: "Une atmosphère détendue qui accompagne les déjeuners et les soirées.",
    icon: Waves
  },
  {
    title: "Adresse de confiance",
    text: "Un lieu connu à El Jadida pour les repas de groupe et les moments à célébrer.",
    icon: Sparkles
  }
];

export default function StorySection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="bg-ivory py-24 sm:py-28">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionIntro
          eyebrow="L’esprit Ali Baba"
          title="Une maison vivante, chaleureuse et tournée vers le partage"
          text={settings.aboutText}
        />

        <Reveal className="overflow-hidden rounded-lg bg-[#131922] shadow-soft">
          <div className="relative h-72 sm:h-80">
            <Image
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1800&q=80"
              alt="Salle du restaurant"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <p className="absolute bottom-4 left-4 max-w-xs text-sm leading-6 text-cream/90">
              Adresse emblématique d’El Jadida pour déjeuner, dîner et recevoir en groupe.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="section-shell mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <Reveal key={pillar.title} delay={index * 0.05} className="rounded-lg bg-cream p-6 shadow-soft">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-copper text-cream">
                <Icon size={18} aria-hidden />
              </div>
              <h3 className="font-display text-3xl font-semibold text-coffee">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-coffee/72">{pillar.text}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
