import type { CategoryModel, DishModel, EventServiceModel, GalleryImageModel } from "@/lib/prisma-types";
import { prisma } from "@/lib/prisma";

type PublicCategoryWithDishes = CategoryModel & {
  dishes: DishModel[];
};

const fallbackEvents: EventServiceModel[] = [
  {
    id: "fallback-event-1",
    title: "Anniversaires",
    description: "Service de table chaleureux pour vos célébrations en famille.",
    imageUrl:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
    sortOrder: 1,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z")
  },
  {
    id: "fallback-event-2",
    title: "Repas de groupe",
    description: "Formats conviviaux pour familles, équipes et amis.",
    imageUrl:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
    isActive: true,
    sortOrder: 2,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z")
  }
];

const fallbackGallery: GalleryImageModel[] = [
  {
    id: "fallback-gallery-1",
    title: "Ambiance chaleureuse",
    imageUrl:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=80",
    alt: "Ambiance chaleureuse du restaurant",
    type: "ambiance",
    isFeatured: true,
    sortOrder: 1,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z")
  },
  {
    id: "fallback-gallery-2",
    title: "Table généreuse",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80",
    alt: "Table de plats méditerranéens",
    type: "plat",
    isFeatured: true,
    sortOrder: 2,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z")
  }
];

const fallbackCategories: PublicCategoryWithDishes[] = [
  {
    id: "fallback-category-1",
    name: "Entrées",
    slug: "entrees",
    sortOrder: 1,
    isActive: true,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    dishes: [
      {
        id: "fallback-dish-1",
        name: "Entrée du jour",
        description: "Sélection maison modifiable depuis le back-office.",
        price: null,
        imageUrl: null,
        categoryId: "fallback-category-1",
        badge: "recommandé",
        isActive: true,
        sortOrder: 1,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z")
      }
    ]
  }
];

const fallbackDishes: (DishModel & { category: CategoryModel })[] = [
  {
    id: "fallback-dish-home-1",
    name: "Poisson du marché",
    description: "Suggestion du chef selon arrivage, modifiable depuis l’administration.",
    price: null,
    imageUrl:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
    categoryId: "fallback-category-poissons",
    badge: "populaire",
    isActive: true,
    sortOrder: 1,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    category: {
      id: "fallback-category-poissons",
      name: "Poissons",
      slug: "poissons",
      sortOrder: 1,
      isActive: true,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z")
    }
  }
];

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
