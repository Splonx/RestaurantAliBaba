import MenuList from "@/components/site/MenuList";
import SiteChrome from "@/components/site/SiteChrome";
import type { CategoryWithDishes, DishModel } from "@/lib/prisma-types";
import { getPublicMenuData } from "@/lib/public-data";
import { metadataForPath } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

export const generateMetadata = () => metadataForPath("/menu");

export default async function MenuPage() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getPublicMenuData()
  ]);

  return (
    <SiteChrome settings={settings}>
      <main>
        <section className="grain-overlay bg-[#10151e] px-5 py-20 text-center text-cream sm:py-24">
          <p className="eyebrow !text-sand">Carte</p>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-none sm:text-7xl">
            Menu
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-cream/75">
            Entrées, poissons, grillades, cuisine marocaine, desserts et boissons.
            Les prix non affichés sont disponibles directement au restaurant.
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
              badge: dish.badge,
              allergens: dish.allergens
            }))
          }))}
        />
      </main>
    </SiteChrome>
  );
}
