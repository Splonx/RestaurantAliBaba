import { Flame, Fish, Soup, Wine } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import SectionIntro from "@/components/site/SectionIntro";

const specialties = [
  {
    title: "Poissons",
    text: "Fraîcheur, simplicité et esprit côtier pour les amateurs de mer.",
    icon: Fish
  },
  {
    title: "Grillades",
    text: "Cuissons franches, marinades orientales et accompagnements généreux.",
    icon: Flame
  },
  {
    title: "Plats marocains",
    text: "Recettes traditionnelles à l’âme familiale, mijotées avec soin.",
    icon: Soup
  },
  {
    title: "Groupes",
    text: "Une table accueillante pour familles, amis et événements privés.",
    icon: Wine
  }
];

export default function SpecialtiesBand() {
  return (
    <section className="bg-[#f1e2cf] py-24 sm:py-28">
      <div className="section-shell">
        <SectionIntro
          eyebrow="Spécialités"
          title="La générosité marocaine, l’élégance méditerranéenne"
          text="Une expérience pensée autour du feu, de la mer, des épices et du partage."
          align="center"
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {specialties.map((specialty, index) => {
            const Icon = specialty.icon;
            return (
              <Reveal key={specialty.title} delay={index * 0.05} className="rounded-lg bg-cream p-6 shadow-soft">
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-lg bg-terracotta text-cream">
                  <Icon size={22} aria-hidden />
                </div>
                <h3 className="font-display text-3xl font-semibold text-coffee">{specialty.title}</h3>
                <p className="mt-3 leading-7 text-coffee/65">{specialty.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
