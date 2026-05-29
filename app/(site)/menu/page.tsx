import type { Metadata } from "next";
import MenuList from "@/components/site/MenuList";
import SiteChrome from "@/components/site/SiteChrome";
import { prisma } from "@/lib/prisma";
import type { CategoryWithDishes, DishModel } from "@/lib/prisma-types";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Menu | Restaurant Ali Baba El Jadida",
  description:
    "Consultez la carte indicative du Restaurant Ali Baba El Jadida : entrées, salades, poissons, grillades, plats marocains, desserts et boissons."
};

export default async function MenuPage() {
  const categoriesQuery: Promise<CategoryWithDishes[]> = prisma.category.findMany({
    where: { isActive: true },
    include: {
      dishes: {
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
      }
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    categoriesQuery
  ]);

  return (
    <SiteChrome settings={settings}>
      <main>
        <section className="moroccan-pattern bg-coffee px-5 py-20 text-center text-cream sm:py-24">
          <p className="eyebrow">Carte publique</p>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-none sm:text-7xl">
            Menu
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-cream/70">
            Restaurant El Jadida pour poissons, grillades, plats marocains et repas
            familiaux. Les prix réels sont à confirmer auprès du restaurant.
          </p>
        </section>
        <MenuList
          categories={categories.map((category: CategoryWithDishes) => ({
            id: category.id,
            name: category.name,
            dishes: category.dishes.map((dish: DishModel) => ({
              id: dish.id,
              name: dish.name,
              description: dish.description,
              price: dish.price,
              imageUrl: dish.imageUrl,
              badge: dish.badge
            }))
          }))}
        />
      </main>
    </SiteChrome>
  );
}
