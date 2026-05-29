import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import SectionIntro from "@/components/site/SectionIntro";
import { displayPrice } from "@/lib/format";

type DishCard = {
  id: string;
  name: string;
  description: string;
  price: string | null;
  imageUrl: string | null;
  badge: string | null;
  categoryName?: string;
};

export default function MenuShowcase({ dishes }: { dishes: DishCard[] }) {
  return (
    <section className="bg-ivory py-24 sm:py-28">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <SectionIntro
            eyebrow="Plats signature"
            title="Des assiettes qui donnent envie de s’attabler"
            text="Sélection placeholder modifiable depuis le back-office : photos, descriptions, badges et prix peuvent être ajustés par le propriétaire."
          />
          <Reveal className="lg:justify-self-end">
            <Link href="/menu" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-coffee px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-terracotta">
              Voir toute la carte
              <ArrowRight size={17} aria-hidden />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dishes.slice(0, 4).map((dish, index) => (
            <Reveal key={dish.id} delay={index * 0.06}>
              <article className="group overflow-hidden rounded-lg bg-cream shadow-soft">
                <div className="relative h-64 overflow-hidden bg-sand/30">
                  {dish.imageUrl ? (
                    <img src={dish.imageUrl} alt={dish.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  ) : null}
                  {dish.badge ? (
                    <span className="absolute left-4 top-4 rounded-lg bg-terracotta px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-cream">
                      {dish.badge}
                    </span>
                  ) : null}
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-olive">
                    {dish.categoryName || "Ali Baba"}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-semibold leading-none text-coffee">
                    {dish.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 min-h-20 leading-7 text-coffee/65">
                    {dish.description}
                  </p>
                  <p className="mt-5 font-semibold text-terracotta">{displayPrice(dish.price)}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
