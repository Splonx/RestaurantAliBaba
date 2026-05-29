import { prisma } from "@/lib/prisma";

export const defaultSettings = {
  heroTitle: "Ali Baba El Jadida",
  heroSubtitle:
    "Cuisine marocaine & méditerranéenne dans une adresse chaleureuse au cœur d’El Jadida",
  aboutText:
    "Restaurant Ali Baba El Jadida célèbre une cuisine généreuse, fraîche et conviviale dans un cadre inspiré des riads marocains contemporains.",
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

export type SiteSettings = typeof defaultSettings;

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await prisma.siteSetting.findMany();
  const dbSettings = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return { ...defaultSettings, ...dbSettings };
}
