import type {
  BrandAssetModel,
  CategoryModel,
  DishModel,
  EventServiceModel,
  GalleryImageModel,
  MenuDocumentModel,
  SeoPageModel,
  TestimonialModel
} from "@/lib/prisma-types";
import menuSource from "@/data/ali-baba-menu.json";
import { prisma } from "@/lib/prisma";

type PublicCategoryWithDishes = CategoryModel & {
  dishes: DishModel[];
};

const seedDate = new Date("2026-01-01T00:00:00.000Z");

function category(id: string, name: string, slug: string, sortOrder: number, dishes: DishModel[]) {
  return {
    id,
    name,
    slug,
    sortOrder,
    isActive: true,
    createdAt: seedDate,
    updatedAt: seedDate,
    dishes
  };
}

function dish(input: {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl?: string;
  badge?: string | null;
  sortOrder: number;
  isFeatured?: boolean;
}): DishModel {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    price: null,
    imageUrl: input.imageUrl ?? null,
    categoryId: input.categoryId,
    badge: input.badge ?? null,
    allergens: null,
    isFeatured: input.isFeatured ?? false,
    isActive: true,
    sortOrder: input.sortOrder,
    createdAt: seedDate,
    updatedAt: seedDate
  };
}

const officialMenuFallbackCategories: PublicCategoryWithDishes[] = menuSource.categories.map(
  (item) =>
    category(
      `fallback-category-${item.slug}`,
      item.name,
      item.slug,
      item.sortOrder,
      item.dishes.map((dishItem) => ({
        id: `fallback-dish-${item.slug}-${dishItem.sortOrder}`,
        name: dishItem.name,
        description: dishItem.description,
        price: dishItem.price,
        imageUrl: dishItem.imageUrl,
        categoryId: `fallback-category-${item.slug}`,
        badge: "badge" in dishItem ? dishItem.badge ?? null : null,
        allergens: "allergens" in dishItem ? dishItem.allergens ?? null : null,
        isFeatured: "badge" in dishItem && Boolean(dishItem.badge),
        isActive: true,
        sortOrder: dishItem.sortOrder,
        createdAt: seedDate,
        updatedAt: seedDate
      }))
    )
);

const fallbackMenuDocument: MenuDocumentModel = {
  id: "fallback-menu-document",
  title: menuSource.document.title,
  fileUrl: menuSource.document.fileUrl,
  isActive: true,
  uploadedAt: seedDate,
  updatedAt: seedDate
};

const fallbackCategories: PublicCategoryWithDishes[] = [
  category("fallback-category-entrees", "Entrées", "entrees", 1, [
    dish({
      id: "fallback-dish-assortiment",
      categoryId: "fallback-category-entrees",
      name: "Assortiment d’entrées marocaines",
      description: "Sélection fraîche et généreuse à partager avant les poissons et grillades.",
      imageUrl:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1400&q=80",
      badge: "recommandé",
      sortOrder: 1,
      isFeatured: true
    })
  ]),
  category("fallback-category-salades", "Salades", "salades", 2, [
    dish({
      id: "fallback-dish-salade",
      categoryId: "fallback-category-salades",
      name: "Salade méditerranéenne",
      description: "Légumes croquants, herbes fraîches et assaisonnement maison.",
      imageUrl:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
      badge: "nouveau",
      sortOrder: 1
    })
  ]),
  category("fallback-category-poissons", "Poissons", "poissons", 3, [
    dish({
      id: "fallback-dish-poisson",
      categoryId: "fallback-category-poissons",
      name: "Poisson selon arrivage",
      description: "Préparation simple et fraîche inspirée de la cuisine de bord de mer.",
      imageUrl:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1400&q=80",
      badge: "populaire",
      sortOrder: 1,
      isFeatured: true
    }),
    dish({
      id: "fallback-dish-sole",
      categoryId: "fallback-category-poissons",
      name: "Sole grillée",
      description: "Cuisson légère, citron, huile d’olive et garniture du moment.",
      imageUrl:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1400&q=80",
      sortOrder: 2
    })
  ]),
  category("fallback-category-grillades", "Grillades", "grillades", 4, [
    dish({
      id: "fallback-dish-entrecote",
      categoryId: "fallback-category-grillades",
      name: "Entrecôte grillée",
      description: "Viande grillée minute, cuisson à la demande et accompagnement maison.",
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=80",
      badge: "populaire",
      sortOrder: 1,
      isFeatured: true
    })
  ]),
  category("fallback-category-marocaine", "Cuisine marocaine", "cuisine-marocaine", 5, [
    dish({
      id: "fallback-dish-tajine",
      categoryId: "fallback-category-marocaine",
      name: "Tajine traditionnel",
      description: "Recette marocaine généreuse, mijotée lentement et pensée pour le partage.",
      imageUrl:
        "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=1400&q=80",
      badge: "recommandé",
      sortOrder: 1
    })
  ]),
  category("fallback-category-desserts", "Desserts", "desserts", 6, [
    dish({
      id: "fallback-dish-dessert",
      categoryId: "fallback-category-desserts",
      name: "Dessert du moment",
      description: "Douceur de fin de repas, idéale avec un thé ou un café.",
      imageUrl:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1400&q=80",
      sortOrder: 1
    })
  ]),
  category("fallback-category-boissons", "Boissons", "boissons", 7, [
    dish({
      id: "fallback-dish-the",
      categoryId: "fallback-category-boissons",
      name: "Thé à la menthe",
      description: "Classique marocain pour prolonger le repas dans une ambiance conviviale.",
      imageUrl:
        "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=1400&q=80",
      sortOrder: 1
    })
  ])
];

const fallbackGallery: GalleryImageModel[] = [
  {
    id: "fallback-gallery-ocean",
    title: "Ambiance bord de mer",
    imageUrl:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
    alt: "Table de restaurant lumineuse avec ambiance méditerranéenne",
    type: "ambiance",
    isFeatured: true,
    sortOrder: 1,
    createdAt: seedDate,
    updatedAt: seedDate
  },
  {
    id: "fallback-gallery-food",
    title: "Cuisine fraîche",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
    alt: "Table garnie de plats méditerranéens",
    type: "plat",
    isFeatured: true,
    sortOrder: 2,
    createdAt: seedDate,
    updatedAt: seedDate
  },
  {
    id: "fallback-gallery-group",
    title: "Repas de groupe",
    imageUrl:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80",
    alt: "Groupe autour d’une table de restaurant",
    type: "événement",
    isFeatured: false,
    sortOrder: 3,
    createdAt: seedDate,
    updatedAt: seedDate
  }
];

const fallbackEvents: EventServiceModel[] = [
  {
    id: "fallback-event-wedding",
    title: "Mariages & fiançailles",
    description: "Un cadre chaleureux pour recevoir les proches autour d’un repas généreux.",
    type: "mariage",
    capacity: "Sur demande",
    imageUrl:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1600&q=80",
    isActive: true,
    sortOrder: 1,
    createdAt: seedDate,
    updatedAt: seedDate
  },
  {
    id: "fallback-event-birthday",
    title: "Anniversaires",
    description: "Une organisation simple pour célébrer en famille ou entre amis.",
    type: "anniversaire",
    capacity: "Groupes",
    imageUrl:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1600&q=80",
    isActive: true,
    sortOrder: 2,
    createdAt: seedDate,
    updatedAt: seedDate
  },
  {
    id: "fallback-event-company",
    title: "Repas entreprise",
    description: "Déjeuners professionnels, repas d’équipe et moments clients à El Jadida.",
    type: "entreprise",
    capacity: "Sur devis",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
    isActive: true,
    sortOrder: 3,
    createdAt: seedDate,
    updatedAt: seedDate
  }
];

const fallbackTestimonials: TestimonialModel[] = [
  {
    id: "fallback-testimonial-1",
    author: "Client Ali Baba",
    quote: "Une adresse conviviale pour les poissons, les grillades et les repas en famille.",
    context: "Avis modifiable depuis l’administration",
    isFeatured: true,
    isActive: true,
    sortOrder: 1,
    createdAt: seedDate,
    updatedAt: seedDate
  },
  {
    id: "fallback-testimonial-2",
    author: "Client groupe",
    quote: "Service attentionné et ambiance chaleureuse pour une grande table.",
    context: "Avis modifiable depuis l’administration",
    isFeatured: true,
    isActive: true,
    sortOrder: 2,
    createdAt: seedDate,
    updatedAt: seedDate
  }
];

const fallbackSeo: Record<string, SeoPageModel> = {
  "/": {
    id: "fallback-seo-home",
    path: "/",
    title: "Restaurant Ali Baba El Jadida | Poissons, grillades & événements",
    description:
      "Restaurant Ali Baba El Jadida : cuisine marocaine, méditerranéenne, poissons, grillades, terrasse et réservations de groupe.",
    keywords: "Restaurant Ali Baba El Jadida, restaurant El Jadida, poissons El Jadida",
    ogImage:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
    slug: "/",
    createdAt: seedDate,
    updatedAt: seedDate
  }
};

const fallbackBrandAssets: BrandAssetModel[] = [
  {
    id: "fallback-brand-logo",
    key: "logo",
    label: "Logo principal",
    value: "AB",
    type: "text",
    createdAt: seedDate,
    updatedAt: seedDate
  },
  {
    id: "fallback-brand-hero",
    key: "heroImage",
    label: "Image hero",
    value:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2200&q=80",
    type: "image",
    createdAt: seedDate,
    updatedAt: seedDate
  },
  {
    id: "fallback-brand-primary",
    key: "primaryColor",
    label: "Couleur principale",
    value: "#B95C3C",
    type: "color",
    createdAt: seedDate,
    updatedAt: seedDate
  }
];

const fallbackDishes = fallbackCategories.flatMap((item) =>
  item.dishes.map((dishItem) => ({
    ...dishItem,
    category: {
      id: item.id,
      name: item.name,
      slug: item.slug,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
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
  const [dishes, gallery, events, testimonials, brandAssets] = await Promise.all([
    safeQuery(
      "home:dishes",
      prisma.dish.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
        take: 8
      }),
      fallbackDishes
    ),
    getPublicGalleryData(),
    getPublicEventsData(),
    getPublicTestimonials(),
    getBrandAssets()
  ]);

  return {
    dishes: dishes.length > 0 ? dishes : fallbackDishes,
    gallery,
    events,
    testimonials,
    brandAssets
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
    officialMenuFallbackCategories
  );

  return categories.length > 0 ? categories : officialMenuFallbackCategories;
}

export async function getPublicMenuDocument() {
  const document = await safeQuery(
    "menu:document",
    prisma.menuDocument.findFirst({
      where: { isActive: true },
      orderBy: { uploadedAt: "desc" }
    }),
    fallbackMenuDocument
  );

  return document ?? fallbackMenuDocument;
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

export async function getPublicTestimonials() {
  const testimonials = await safeQuery(
    "testimonials:list",
    prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }]
    }),
    fallbackTestimonials
  );

  return testimonials.length > 0 ? testimonials : fallbackTestimonials;
}

export async function getSeoPage(path: string) {
  const fallback = fallbackSeo[path] ?? {
    ...fallbackSeo["/"],
    id: `fallback-seo-${path}`,
    path,
    slug: path
  };
  return safeQuery(
    `seo:${path}`,
    prisma.seoPage.findUnique({ where: { path } }),
    fallback
  ).then((seo) => seo ?? fallback);
}

export async function getBrandAssets() {
  const assets = await safeQuery(
    "brand:assets",
    prisma.brandAsset.findMany({ orderBy: { label: "asc" } }),
    fallbackBrandAssets
  );

  return assets.length > 0 ? assets : fallbackBrandAssets;
}

export function getBrandAssetValue(assets: BrandAssetModel[], key: string, fallback = "") {
  return assets.find((asset) => asset.key === key)?.value ?? fallback;
}
