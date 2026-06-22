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
  { name: "Cuisine marocaine", slug: "cuisine-marocaine", sortOrder: 5 },
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
    allergens: "À confirmer",
    isFeatured: true,
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
    allergens: null,
    isFeatured: false,
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
    allergens: "Poisson",
    isFeatured: true,
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
    allergens: null,
    isFeatured: true,
    sortOrder: 1
  },
  {
    name: "Tajine traditionnel",
    description: "Plat mijoté aux épices douces, servi dans l’esprit des repas familiaux.",
    price: null,
    imageUrl:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "cuisine-marocaine",
    badge: "recommandé",
    allergens: "À confirmer",
    isFeatured: true,
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
    allergens: null,
    isFeatured: false,
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
    allergens: null,
    isFeatured: false,
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
    type: "anniversaire",
    capacity: "Groupes",
    description: "Une table chaleureuse pour célébrer avec famille et amis.",
    imageUrl:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 1
  },
  {
    title: "Repas de groupe",
    type: "repas de groupe",
    capacity: "Sur demande",
    description: "Des formats conviviaux autour de plats à partager.",
    imageUrl:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 2
  },
  {
    title: "Soirées privées",
    type: "événement privé",
    capacity: "Sur devis",
    description: "Une atmosphère chic pour vos moments importants.",
    imageUrl:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 3
  },
  {
    title: "Déjeuners professionnels",
    type: "entreprise",
    capacity: "Sur demande",
    description: "Un emplacement facile d’accès pour recevoir partenaires et équipes.",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 4
  },
  {
    title: "Familles",
    type: "repas de groupe",
    capacity: "Familles",
    description: "Une adresse conviviale pour petits et grands autour d’une cuisine généreuse.",
    imageUrl:
      "https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=1200&q=80",
    sortOrder: 5
  }
];

const testimonials = [
  {
    author: "Client Ali Baba",
    quote: "Une adresse conviviale pour les poissons, les grillades et les repas en famille.",
    context: "Avis administrable",
    isFeatured: true,
    sortOrder: 1
  },
  {
    author: "Client groupe",
    quote: "Service attentionné et ambiance chaleureuse pour une grande table.",
    context: "Avis administrable",
    isFeatured: true,
    sortOrder: 2
  }
];

const seoPages = [
  ["/", "Restaurant Ali Baba El Jadida | Poissons, grillades & événements", "Restaurant Ali Baba El Jadida : cuisine marocaine, méditerranéenne, poissons, grillades et réservations de groupe."],
  ["/menu", "Menu Restaurant Ali Baba | Carte & Prix à El Jadida", "Consultez le menu du Restaurant Ali Baba à El Jadida : plats, spécialités, prix et carte complète en ligne."],
  ["/galerie", "Galerie | Restaurant Ali Baba El Jadida", "Photos de l’ambiance, des plats, de la salle et des événements du Restaurant Ali Baba El Jadida."],
  ["/evenements", "Événements | Restaurant Ali Baba El Jadida", "Mariages, anniversaires, repas de groupe, événements privés et entreprise au Restaurant Ali Baba El Jadida."],
  ["/a-propos", "À propos | Restaurant Ali Baba El Jadida", "Découvrez l’esprit chaleureux, familial, marocain contemporain et méditerranéen du Restaurant Ali Baba El Jadida."],
  ["/contact", "Contact | Restaurant Ali Baba El Jadida", "Contactez le Restaurant Ali Baba El Jadida par téléphone, WhatsApp ou Instagram."],
  ["/reservation", "Réservation | Restaurant Ali Baba El Jadida", "Réservez une table ou envoyez une demande de groupe au Restaurant Ali Baba El Jadida."]
];

const brandAssets = [
  { key: "logo", label: "Logo principal", value: "AB", type: "text" },
  {
    key: "heroImage",
    label: "Image hero",
    value: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2200&q=80",
    type: "image"
  },
  { key: "primaryColor", label: "Couleur principale", value: "#B95C3C", type: "color" },
  { key: "secondaryColor", label: "Couleur secondaire", value: "#4F5B3A", type: "color" },
  { key: "favicon", label: "Favicon", value: "/favicon.ico", type: "url" }
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
        allergens: dish.allergens,
        isFeatured: dish.isFeatured,
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
        type: event.type,
        capacity: event.capacity,
        imageUrl: event.imageUrl,
        isActive: true,
        sortOrder: event.sortOrder
      }
    });
  }
}

async function seedTestimonials() {
  for (const testimonial of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { author: testimonial.author, quote: testimonial.quote }
    });
    if (existing) continue;
    await prisma.testimonial.create({
      data: {
        ...testimonial,
        isActive: true
      }
    });
  }
}

async function seedSeoPages() {
  for (const [path, title, description] of seoPages) {
    await prisma.seoPage.upsert({
      where: { path },
      update: {},
      create: {
        path,
        title,
        description,
        keywords: "Restaurant Ali Baba El Jadida, restaurant El Jadida, poissons El Jadida",
        ogImage:
          "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
        slug: path
      }
    });
  }
}

async function seedBrandAssets() {
  for (const asset of brandAssets) {
    await prisma.brandAsset.upsert({
      where: { key: asset.key },
      update: {},
      create: asset
    });
  }
}

async function seedAdminUsers() {
  const email = process.env.ADMIN_EMAIL ?? process.env.ADMIN_USERNAME;
  if (!email) return;
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Administrateur Ali Baba",
      role: "Admin",
      isActive: true
    }
  });
}

async function main() {
  await seedSettings();
  await seedCategories();
  await seedDishes();
  await seedGallery();
  await seedEvents();
  await seedTestimonials();
  await seedSeoPages();
  await seedBrandAssets();
  await seedAdminUsers();
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
