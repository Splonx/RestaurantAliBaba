import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function getConnectionString() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required. Configure a PostgreSQL connection string before running the seed."
    );
  }
  return databaseUrl;
}

const connectionString = getConnectionString();

const adapter = new PrismaPg(
  new Pool({
    connectionString
  })
);

const prisma = new PrismaClient({ adapter });

const settings = {
  heroTitle: "Ali Baba El Jadida",
  heroSubtitle:
    "Cuisine marocaine & méditerranéenne dans une adresse chaleureuse au cœur d’El Jadida",
  aboutText:
    "Restaurant Ali Baba El Jadida célèbre une cuisine généreuse, fraîche et conviviale dans un cadre inspiré des riads marocains contemporains. Une adresse idéale pour déjeuner, dîner, recevoir la famille, organiser un repas de groupe ou partager un moment privé.",
  phone: "06.61.29.92.47",
  landline: "05.23.34.16.22",
  whatsapp: "+212661299247",
  address: "Route de Casablanca n°8, El Jadida",
  instagram: "@restaurantalibabaeljadida",
  instagramUrl: "https://www.instagram.com/restaurantalibabaeljadida/",
  hours: "Horaires à confirmer auprès du restaurant",
  footerText:
    "Cuisine marocaine et méditerranéenne, poissons, grillades et événements privés à El Jadida."
};

const categories = [
  { name: "Entrées", slug: "entrees", sortOrder: 1 },
  { name: "Salades", slug: "salades", sortOrder: 2 },
  { name: "Poissons", slug: "poissons", sortOrder: 3 },
  { name: "Grillades", slug: "grillades", sortOrder: 4 },
  { name: "Plats marocains", slug: "plats-marocains", sortOrder: 5 },
  { name: "Desserts", slug: "desserts", sortOrder: 6 },
  { name: "Boissons", slug: "boissons", sortOrder: 7 }
];

const dishes = [
  {
    name: "Assortiment marocain",
    description: "Sélection d’entrées fraîches et épicées, idéale pour commencer à partager.",
    price: null,
    imageUrl:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "entrees",
    badge: "recommandé",
    sortOrder: 1
  },
  {
    name: "Salade méditerranéenne",
    description: "Légumes croquants, herbes fraîches et assaisonnement maison.",
    price: null,
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "salades",
    badge: "nouveau",
    sortOrder: 1
  },
  {
    name: "Poisson selon arrivage",
    description: "Poisson frais préparé selon l’inspiration du jour et les arrivages.",
    price: null,
    imageUrl:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "poissons",
    badge: "populaire",
    sortOrder: 1
  },
  {
    name: "Mix grill à partager",
    description: "Sélection de viandes grillées, marinades orientales et accompagnements.",
    price: null,
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "grillades",
    badge: "populaire",
    sortOrder: 1
  },
  {
    name: "Tajine traditionnel",
    description: "Plat mijoté aux épices douces, servi dans l’esprit des repas familiaux.",
    price: null,
    imageUrl:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "plats-marocains",
    badge: "recommandé",
    sortOrder: 1
  },
  {
    name: "Douceur maison",
    description: "Dessert du moment, parfait avec un thé à la menthe ou un café.",
    price: null,
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "desserts",
    badge: null,
    sortOrder: 1
  },
  {
    name: "Thé à la menthe",
    description: "Le classique marocain pour prolonger le repas avec élégance.",
    price: null,
    imageUrl:
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "boissons",
    badge: null,
    sortOrder: 1
  }
];

const gallery = [
  {
    title: "Table généreuse",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80",
    alt: "Table garnie de plats méditerranéens",
    type: "plat",
    isFeatured: true,
    sortOrder: 1
  },
  {
    title: "Ambiance chaleureuse",
    imageUrl:
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=80",
    alt: "Restaurant élégant en lumière chaude",
    type: "ambiance",
    isFeatured: true,
    sortOrder: 2
  },
  {
    title: "Repas de groupe",
    imageUrl:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=80",
    alt: "Groupe autour d’une table de restaurant",
    type: "événement",
    isFeatured: false,
    sortOrder: 3
  },
  {
    title: "Salle conviviale",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80",
    alt: "Salle de restaurant conviviale",
    type: "salle",
    isFeatured: false,
    sortOrder: 4
  },
  {
    title: "Cuisine fraîche",
    imageUrl:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1400&q=80",
    alt: "Assiettes dressées et cuisine colorée",
    type: "plat",
    isFeatured: true,
    sortOrder: 5
  }
];

const events = [
  {
    title: "Anniversaires",
    description: "Une table chaleureuse pour célébrer avec famille et amis.",
    imageUrl:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 1
  },
  {
    title: "Repas de groupe",
    description: "Des formats conviviaux autour de plats à partager.",
    imageUrl:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 2
  },
  {
    title: "Soirées privées",
    description: "Une atmosphère chic pour vos moments importants.",
    imageUrl:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 3
  },
  {
    title: "Déjeuners professionnels",
    description: "Un emplacement facile d’accès pour recevoir partenaires et équipes.",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 4
  },
  {
    title: "Familles",
    description: "Une adresse conviviale pour petits et grands autour d’une cuisine généreuse.",
    imageUrl:
      "https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 5
  }
];

async function seedSettings() {
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value }
    });
  }
}

async function seedCategories() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        sortOrder: category.sortOrder,
        isActive: true
      },
      create: {
        name: category.name,
        slug: category.slug,
        sortOrder: category.sortOrder,
        isActive: true
      }
    });
  }
}

async function seedDishes() {
  const categoryBySlug = Object.fromEntries(
    (await prisma.category.findMany()).map((category) => [category.slug, category.id])
  );

  for (const dish of dishes) {
    const categoryId = categoryBySlug[dish.categorySlug];
    if (!categoryId) continue;

    const existing = await prisma.dish.findFirst({
      where: {
        name: dish.name,
        categoryId
      }
    });
    if (existing) continue;

    await prisma.dish.create({
      data: {
        name: dish.name,
        description: dish.description,
        price: dish.price,
        imageUrl: dish.imageUrl,
        badge: dish.badge,
        sortOrder: dish.sortOrder,
        categoryId
      }
    });
  }
}

async function seedGallery() {
  for (const image of gallery) {
    const existing = await prisma.galleryImage.findFirst({
      where: {
        title: image.title,
        type: image.type
      }
    });
    if (existing) continue;
    await prisma.galleryImage.create({ data: image });
  }
}

async function seedEvents() {
  for (const event of events) {
    const existing = await prisma.eventService.findFirst({
      where: { title: event.title }
    });
    if (existing) continue;

    await prisma.eventService.create({
      data: {
        title: event.title,
        description: event.description,
        imageUrl: event.imageUrl,
        isActive: true,
        sortOrder: event.sortOrder
      }
    });
  }
}

async function main() {
  await seedSettings();
  await seedCategories();
  await seedDishes();
  await seedGallery();
  await seedEvents();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
