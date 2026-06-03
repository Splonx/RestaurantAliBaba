import { ArrowRight } from "lucide-react";
import Image from "next/image";
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
  allergens: string | null;
  categoryName?: string;
};

export default function MenuShowcase({ dishes }: { dishes: DishCard[] }) {
  return (
    <section className="bg-cream py-24 sm:py-28">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <SectionIntro
            eyebrow="Menu vivant"
            title="Des plats qui parlent de mer, de braise et de partage"
            text="La carte évolue selon les arrivages et la saison. Les prix sont confirmés directement au restaurant."
          />
          <Reveal className="lg:justify-self-end">
            <Link
              href="/menu"
              className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[#10151e] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-copper"
            >
              Voir tout le menu
              <ArrowRight size={17} aria-hidden />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dishes.slice(0, 8).map((dish, index) => (
            <Reveal key={dish.id} delay={index * 0.04}>
              <article className="h-full overflow-hidden rounded-lg border border-coffee/10 bg-white shadow-soft">
                <div className="relative h-60 overflow-hidden bg-sand/25">
                  {dish.imageUrl ? (
                    <Image
                      src={dish.imageUrl}
                      alt={dish.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover transition duration-700 hover:scale-105"
                    />
                  ) : null}
                  {dish.badge ? (
                    <span className="absolute left-3 top-3 rounded-lg bg-copper px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-cream">
                      {dish.badge}
                    </span>
                  ) : null}
                </div>
                <div className="p-5">
                  <p className="text-[0.67rem] font-bold uppercase tracking-[0.14em] text-sea">
                    {dish.categoryName || "Ali Baba"}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-semibold leading-none text-coffee">
                    {dish.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-coffee/70">{dish.description}</p>
                  {dish.allergens ? (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-olive">
                      Allergènes : {dish.allergens}
                    </p>
                  ) : null}
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.1em] text-copper">
                    {displayPrice(dish.price)}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
