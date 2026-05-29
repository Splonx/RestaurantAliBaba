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
  }[];
};

export default function MenuList({ categories }: { categories: MenuCategory[] }) {
  return (
    <section className="bg-ivory py-20 sm:py-24">
      <div className="section-shell">
        <SectionIntro
          eyebrow="Carte"
          title="Menu Ali Baba"
          text="Carte indicative : les plats, prix et disponibilités sont modifiables depuis le back-office. Si aucun prix réel n’est saisi, le site affiche “Prix à confirmer”."
          align="center"
        />

        <div className="mt-14 space-y-12">
          {categories.map((category) => (
            <section key={category.id} className="rounded-lg bg-cream p-5 shadow-soft sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-4 border-b border-coffee/10 pb-5">
                <h2 className="font-display text-4xl font-semibold text-coffee">{category.name}</h2>
                <span className="text-sm font-bold uppercase tracking-[0.16em] text-terracotta">
                  {category.dishes.length} plat{category.dishes.length > 1 ? "s" : ""}
                </span>
              </div>

              {category.dishes.length === 0 ? (
                <p className="py-8 text-center text-coffee/55">Aucun plat actif dans cette catégorie.</p>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {category.dishes.map((dish) => (
                    <article key={dish.id} className="flex gap-4 rounded-lg border border-coffee/10 bg-white/65 p-3">
                      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-sand/30">
                        {dish.imageUrl ? <img src={dish.imageUrl} alt={dish.name} className="h-full w-full object-cover" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-display text-2xl font-semibold leading-none text-coffee">{dish.name}</h3>
                            {dish.badge ? <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-olive">{dish.badge}</p> : null}
                          </div>
                          <p className="shrink-0 font-semibold text-terracotta">{displayPrice(dish.price)}</p>
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-coffee/65">{dish.description}</p>
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
