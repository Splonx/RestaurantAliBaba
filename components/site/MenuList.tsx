import Image from "next/image";
import SectionIntro from "@/components/site/SectionIntro";
import { displayPrice } from "@/lib/format";

type MenuCategory = {
  id: string;
  name: string;
  dishes: {
    id: string;
    name: string;
    description: string;
    price: string | null;
    imageUrl: string | null;
    badge: string | null;
    allergens: string | null;
  }[];
};

function toAnchor(label: string) {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function MenuList({ categories }: { categories: MenuCategory[] }) {
  return (
    <section className="bg-ivory py-20 sm:py-24">
      <div className="section-shell">
        <SectionIntro
          eyebrow="Carte"
          title="Menu Ali Baba El Jadida"
          text="La carte est mise à jour depuis l’administration. Quand le prix n’est pas publié, le site affiche “Disponible au restaurant”."
          align="center"
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#${toAnchor(category.name)}`}
              className="focus-ring rounded-full border border-coffee/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-coffee transition hover:border-copper hover:text-copper"
            >
              {category.name}
            </a>
          ))}
        </div>

        <div className="mt-12 space-y-10">
          {categories.map((category) => (
            <section
              key={category.id}
              id={toAnchor(category.name)}
              className="rounded-lg border border-coffee/10 bg-cream p-5 shadow-soft sm:p-7"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-coffee/10 pb-4">
                <h2 className="font-display text-4xl font-semibold text-coffee">{category.name}</h2>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-copper">
                  {category.dishes.length} plat{category.dishes.length > 1 ? "s" : ""}
                </span>
              </div>

              {category.dishes.length === 0 ? (
                <p className="py-6 text-center text-sm text-coffee/60">Aucun plat actif dans cette catégorie.</p>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {category.dishes.map((dish) => (
                    <article
                      key={dish.id}
                      className="flex gap-4 rounded-lg border border-coffee/10 bg-white/70 p-3"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-sand/30">
                        {dish.imageUrl ? (
                          <Image
                            src={dish.imageUrl}
                            alt={dish.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-display text-2xl font-semibold leading-none text-coffee">
                              {dish.name}
                            </h3>
                            {dish.badge ? (
                              <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-sea">
                                {dish.badge}
                              </p>
                            ) : null}
                          </div>
                          <p className="text-xs font-bold uppercase tracking-[0.1em] text-copper">
                            {displayPrice(dish.price)}
                          </p>
                        </div>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-coffee/70">{dish.description}</p>
                        {dish.allergens ? (
                          <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-olive">
                            Allergènes : {dish.allergens}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
