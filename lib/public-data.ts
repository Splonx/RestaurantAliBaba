import type { CategoryModel, DishModel, EventServiceModel, GalleryImageModel } from "@/lib/prisma-types";
import { prisma } from "@/lib/prisma";

type PublicCategoryWithDishes = CategoryModel & {
  dishes: DishModel[];
};

const seedDate = new Date("2026-01-01T00:00:00.000Z");

const fallbackEvents: EventServiceModel[] = [
  {
    id: "fallback-event-family",
    title: "Réservations famille",
    description: "Grandes tablées, service fluide et ambiance chaleureuse pour vos déjeuners et dîners.",
    imageUrl:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80",
    isActive: true,
    sortOrder: 1,
    createdAt: seedDate,
    updatedAt: seedDate
  },
  {
    id: "fallback-event-groups",
    title: "Repas de groupe",
    description: "Format convivial pour amis, équipes et événements privés jusqu’à tard le soir.",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    isActive: true,
    sortOrder: 2,
    createdAt: seedDate,
    updatedAt: seedDate
  },
  {
    id: "fallback-event-birthday",
    title: "Anniversaires & célébrations",
    description: "Un cadre élégant et vivant pour célébrer en bord de mer à El Jadida.",
    imageUrl:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1600&q=80",
    isActive: true,
    sortOrder: 3,
    createdAt: seedDate,
    updatedAt: seedDate
  }
];

const fallbackGallery: GalleryImageModel[] = [
  {
    id: "fallback-gallery-1",
    title: "Poissons du jour",
    imageUrl:
      "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1600&q=80",
    alt: "Poisson grillé servi dans une assiette méditerranéenne",
    type: "plat",
    isFeatured: true,
    sortOrder: 1,
    createdAt: seedDate,
    updatedAt: seedDate
  },
  {
    id: "fallback-gallery-2",
    title: "Salle principale",
    imageUrl:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80",
    alt: "Salle chaleureuse avec lumière tamisée",
    type: "salle",
    isFeatured: true,
    sortOrder: 2,
    createdAt: seedDate,
    updatedAt: seedDate
  },
  {
    id: "fallback-gallery-3",
    title: "Terrasse & vue",
    imageUrl:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
    alt: "Terrasse de restaurant en journée",
    type: "ambiance",
    isFeatured: true,
    sortOrder: 3,
    createdAt: seedDate,
    updatedAt: seedDate
  },
  {
    id: "fallback-gallery-4",
    title: "Grillades maison",
    imageUrl:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1600&q=80",
    alt: "Viandes grillées et garnitures",
    type: "plat",
    isFeatured: false,
    sortOrder: 4,
    createdAt: seedDate,
    updatedAt: seedDate
  },
  {
    id: "fallback-gallery-5",
    title: "Service du soir",
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
    alt: "Ambiance de dîner dans un restaurant élégant",
    type: "événement",
    isFeatured: false,
    sortOrder: 5,
    createdAt: seedDate,
    updatedAt: seedDate
  }
];

const fallbackCategories: PublicCategoryWithDishes[] = [
  {
    id: "fallback-category-entrees",
    name: "Entrées",
    slug: "entrees",
    sortOrder: 1,
    isActive: true,
    createdAt: seedDate,
    updatedAt: seedDate,
    dishes: [
      {
        id: "fallback-dish-ceviche",
        name: "Ceviche maison",
        description: "Poisson mariné minute, agrumes, herbes fraîches.",
        price: null,
        imageUrl: null,
        categoryId: "fallback-category-entrees",
        badge: "recommandé",
        isActive: true,
        sortOrder: 1,
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        id: "fallback-dish-salades",
        name: "Assortiment de salades marocaines",
        description: "Sélection fraîche servie à partager.",
        price: null,
        imageUrl: null,
        categoryId: "fallback-category-entrees",
        badge: null,
        isActive: true,
        sortOrder: 2,
        createdAt: seedDate,
        updatedAt: seedDate
      }
    ]
  },
  {
    id: "fallback-category-poissons",
    name: "Poissons",
    slug: "poissons",
    sortOrder: 2,
    isActive: true,
    createdAt: seedDate,
    updatedAt: seedDate,
    dishes: [
      {
        id: "fallback-dish-poisson-marocain",
        name: "Poisson marocain",
        description: "Cuisson au four et sauce maison, selon arrivage.",
        price: null,
        imageUrl: null,
        categoryId: "fallback-category-poissons",
        badge: "populaire",
        isActive: true,
        sortOrder: 1,
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        id: "fallback-dish-thon-rouge",
        name: "Thon rouge",
        description: "Pièce snackée, garniture du jour.",
        price: null,
        imageUrl: null,
        categoryId: "fallback-category-poissons",
        badge: null,
        isActive: true,
        sortOrder: 2,
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        id: "fallback-dish-sole",
        name: "Sole grillée",
        description: "Préparation simple, citron, huile d’olive et herbes.",
        price: null,
        imageUrl: null,
        categoryId: "fallback-category-poissons",
        badge: null,
        isActive: true,
        sortOrder: 3,
        createdAt: seedDate,
        updatedAt: seedDate
      }
    ]
  },
  {
    id: "fallback-category-grillades",
    name: "Grillades",
    slug: "grillades",
    sortOrder: 3,
    isActive: true,
    createdAt: seedDate,
    updatedAt: seedDate,
    dishes: [
      {
        id: "fallback-dish-entrecote",
        name: "Entrecôte",
        description: "Viande grillée minute, cuisson à la demande.",
        price: null,
        imageUrl: null,
        categoryId: "fallback-category-grillades",
        badge: "populaire",
        isActive: true,
        sortOrder: 1,
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        id: "fallback-dish-steak",
        name: "Steak maison",
        description: "Pièce grillée et accompagnement du chef.",
        price: null,
        imageUrl: null,
        categoryId: "fallback-category-grillades",
        badge: null,
        isActive: true,
        sortOrder: 2,
        createdAt: seedDate,
        updatedAt: seedDate
      }
    ]
  },
  {
    id: "fallback-category-marocaine",
    name: "Cuisine marocaine",
    slug: "cuisine-marocaine",
    sortOrder: 4,
    isActive: true,
    createdAt: seedDate,
    updatedAt: seedDate,
    dishes: [
      {
        id: "fallback-dish-tajine",
        name: "Tajine traditionnel",
        description: "Recette marocaine généreuse mijotée lentement.",
        price: null,
        imageUrl: null,
        categoryId: "fallback-category-marocaine",
        badge: "recommandé",
        isActive: true,
        sortOrder: 1,
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        id: "fallback-dish-paella",
        name: "Paëlla maison",
        description: "Version de la maison, à partager.",
        price: null,
        imageUrl: null,
        categoryId: "fallback-category-marocaine",
        badge: null,
        isActive: true,
        sortOrder: 2,
        createdAt: seedDate,
        updatedAt: seedDate
      }
    ]
  },
  {
    id: "fallback-category-desserts",
    name: "Desserts",
    slug: "desserts",
    sortOrder: 5,
    isActive: true,
    createdAt: seedDate,
    updatedAt: seedDate,
    dishes: [
      {
        id: "fallback-dish-parfait",
        name: "Parfait",
        description: "Dessert glacé selon disponibilité.",
        price: null,
        imageUrl: null,
        categoryId: "fallback-category-desserts",
        badge: null,
        isActive: true,
        sortOrder: 1,
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        id: "fallback-dish-fruitcake",
        name: "Gâteau aux fruits",
        description: "Douceur de fin de repas.",
        price: null,
        imageUrl: null,
        categoryId: "fallback-category-desserts",
        badge: null,
        isActive: true,
        sortOrder: 2,
        createdAt: seedDate,
        updatedAt: seedDate
      }
    ]
  },
  {
    id: "fallback-category-boissons",
    name: "Boissons",
    slug: "boissons",
    sortOrder: 6,
    isActive: true,
    createdAt: seedDate,
    updatedAt: seedDate,
    dishes: [
      {
        id: "fallback-dish-vin",
        name: "Sélection de vins",
        description: "Rouge, rosé ou blanc selon carte du moment.",
        price: null,
        imageUrl: null,
        categoryId: "fallback-category-boissons",
        badge: null,
        isActive: true,
        sortOrder: 1,
        createdAt: seedDate,
        updatedAt: seedDate
      },
      {
        id: "fallback-dish-the",
        name: "Thé & café",
        description: "Service chaud pour accompagner le dessert.",
        price: null,
        imageUrl: null,
        categoryId: "fallback-category-boissons",
        badge: null,
        isActive: true,
        sortOrder: 2,
        createdAt: seedDate,
        updatedAt: seedDate
      }
    ]
  }
];

const fallbackDishes: (DishModel & { category: CategoryModel })[] = fallbackCategories.flatMap(
  (category) =>
    category.dishes.slice(0, 2).map((dish) => ({
      ...dish,
      imageUrl:
        dish.imageUrl ??
        (category.slug === "poissons"
          ? "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1400&q=80"
          : category.slug === "grillades"
            ? "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=80"
            : category.slug === "desserts"
              ? "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1400&q=80"
              : "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=80"),
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }
    }))
);

async function safeQuery<T>(label: string, query: Promise<T>, fallback: T): Promise<T> {
  try {
    return await query;
  } catch (error) {
    console.error(`[public-data] ${label} failed`, error);
    return fallback;
  }
}

export async function getPublicHomeData() {
  const [dishes, gallery, events] = await Promise.all([
    safeQuery(
      "home:dishes",
      prisma.dish.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: [{ badge: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
        take: 8
      }),
      fallbackDishes
    ),
    safeQuery(
      "home:gallery",
      prisma.galleryImage.findMany({
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
      }),
      fallbackGallery
    ),
    safeQuery(
      "home:events",
      prisma.eventService.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
      }),
      fallbackEvents
    )
  ]);

  return {
    dishes: dishes.length > 0 ? dishes : fallbackDishes,
    gallery: gallery.length > 0 ? gallery : fallbackGallery,
    events: events.length > 0 ? events : fallbackEvents
  };
}

export async function getPublicMenuData() {
  const categories = await safeQuery(
    "menu:categories",
    prisma.category.findMany({
      where: { isActive: true },
      include: {
        dishes: {
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
        }
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    }),
    fallbackCategories
  );

  return categories.length > 0 ? categories : fallbackCategories;
}

export async function getPublicGalleryData() {
  const gallery = await safeQuery(
    "gallery:images",
    prisma.galleryImage.findMany({
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
    }),
    fallbackGallery
  );

  return gallery.length > 0 ? gallery : fallbackGallery;
}

export async function getPublicEventsData() {
  const events = await safeQuery(
    "events:list",
    prisma.eventService.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
    }),
    fallbackEvents
  );

  return events.length > 0 ? events : fallbackEvents;
}
