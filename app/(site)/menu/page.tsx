import MenuList from "@/components/site/MenuList";
import SiteChrome from "@/components/site/SiteChrome";
import type { CategoryWithDishes, DishModel } from "@/lib/prisma-types";
import { getPublicMenuData, getPublicMenuDocument } from "@/lib/public-data";
import { getSiteSettings } from "@/lib/settings";
import { getSiteUrl } from "@/lib/site-url";

type PublicMenuCategory = {
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

export const metadata = {
  title: "Menu Restaurant Ali Baba | Carte & Prix à El Jadida",
  description:
    "Consultez le menu du Restaurant Ali Baba à El Jadida : plats, spécialités, prix et carte complète en ligne."
};

export default async function MenuPage() {
  const [settings, categories, menuDocument] = await Promise.all([
    getSiteSettings(),
    getPublicMenuData(),
    getPublicMenuDocument()
  ]);
  const menuUrl = `${getSiteUrl()}/menu`;
  const menuCategories: PublicMenuCategory[] = categories.map((category: CategoryWithDishes) => ({
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
  }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Menu Restaurant Ali Baba",
    url: menuUrl,
    hasMenuSection: menuCategories.map((category: PublicMenuCategory) => ({
      "@type": "MenuSection",
      name: category.name,
      hasMenuItem: category.dishes.map((dish: PublicMenuCategory["dishes"][number]) => ({
        "@type": "MenuItem",
        name: dish.name,
        description: dish.description,
        offers: dish.price
          ? {
              "@type": "Offer",
              priceCurrency: "MAD",
              price: dish.price.replace(/[^\d/]/g, "")
            }
          : undefined
      }))
    }))
  };

  return (
    <SiteChrome settings={settings}>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <section className="grain-overlay bg-[#10151e] px-5 py-14 text-cream sm:py-16">
          <div className="section-shell">
            <p className="eyebrow !text-sand">Carte & prix</p>
            <h1 className="mt-3 font-display text-6xl font-semibold leading-none sm:text-7xl">
              Notre Menu
            </h1>
            <p className="mt-5 max-w-2xl leading-8 text-cream/75">
              Découvrez la carte complète du Restaurant Ali Baba à El Jadida :
              entrées, poissons, viandes, pizzas, pastas, boissons et desserts.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={menuDocument.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring rounded-lg bg-terracotta px-5 py-3 text-sm font-bold text-cream transition hover:bg-copper"
              >
                Consulter le menu PDF
              </a>
              <a
                href={menuDocument.fileUrl}
                download
                className="focus-ring rounded-lg border border-cream/20 px-5 py-3 text-sm font-bold text-cream transition hover:bg-cream/10"
              >
                Télécharger le menu PDF
              </a>
            </div>
          </div>
        </section>
        <MenuList
          categories={menuCategories}
          pdfUrl={menuDocument.fileUrl}
        />
      </main>
    </SiteChrome>
  );
}
