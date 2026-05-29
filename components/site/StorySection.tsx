import { Leaf, MapPin, Utensils, UsersRound } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import SectionIntro from "@/components/site/SectionIntro";
import type { SiteSettings } from "@/lib/settings";

const cards = [
  { title: "Cuisine généreuse", text: "Des plats pensés pour partager et se faire plaisir.", icon: Utensils },
  { title: "Produits frais", text: "Une carte vivante, guidée par les arrivages et la saison.", icon: Leaf },
  { title: "Familles & groupes", text: "Un accueil adapté aux repas conviviaux et événements.", icon: UsersRound },
  { title: "Accès facile", text: "Une adresse pratique sur la Route de Casablanca.", icon: MapPin }
];

export default function StorySection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="moroccan-pattern bg-ivory py-24 sm:py-28">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <SectionIntro
          eyebrow="Storytelling"
          title="Une adresse chaleureuse, raffinée et profondément conviviale"
          text={settings.aboutText}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={index * 0.06} className="rounded-lg bg-cream/90 p-6 shadow-soft backdrop-blur">
                <div className="mb-5 grid h-11 w-11 place-items-center rounded-lg bg-olive text-cream">
                  <Icon size={21} aria-hidden />
                </div>
                <h3 className="font-display text-3xl font-semibold text-coffee">{card.title}</h3>
                <p className="mt-3 leading-7 text-coffee/65">{card.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
