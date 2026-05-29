import { prisma } from "@/lib/prisma";
import type { SiteSettingModel } from "@/lib/prisma-types";

export const defaultSettings = {
  heroTitle: "Ali Baba El Jadida",
  heroSubtitle:
    "Cuisine marocaine & méditerranéenne dans une adresse chaleureuse au cœur d’El Jadida",
  aboutText:
    "Restaurant Ali Baba El Jadida célèbre une cuisine généreuse, fraîche et conviviale dans un cadre inspiré des riads marocains contemporains.",
  phone: "06.61.29.92.47",
  landline: "05.23.34.16.22",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    ? `+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`
    : "+212661299247",
  address: "Route de Casablanca n°8, El Jadida",
  instagram: "@restaurantalibabaeljadida",
  instagramUrl: "https://www.instagram.com/restaurantalibabaeljadida/",
  hours: "Horaires à confirmer auprès du restaurant",
  footerText:
    "Cuisine marocaine et méditerranéenne, poissons, grillades et événements privés à El Jadida."
};

export type SiteSettings = typeof defaultSettings;

function normalizeText(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function normalizeUrl(value: unknown, fallback: string) {
  if (typeof value !== "string" || value.trim().length === 0) return fallback;
  try {
    const normalized = new URL(value.trim());
    if (normalized.protocol === "http:" || normalized.protocol === "https:") {
      return normalized.toString();
    }
    return fallback;
  } catch {
    return fallback;
  }
}

function sanitizeSettings(input: Partial<Record<keyof SiteSettings, unknown>>): SiteSettings {
  return {
    heroTitle: normalizeText(input.heroTitle, defaultSettings.heroTitle),
    heroSubtitle: normalizeText(input.heroSubtitle, defaultSettings.heroSubtitle),
    aboutText: normalizeText(input.aboutText, defaultSettings.aboutText),
    phone: normalizeText(input.phone, defaultSettings.phone),
    landline: normalizeText(input.landline, defaultSettings.landline),
    whatsapp: normalizeText(input.whatsapp, defaultSettings.whatsapp),
    address: normalizeText(input.address, defaultSettings.address),
    instagram: normalizeText(input.instagram, defaultSettings.instagram),
    instagramUrl: normalizeUrl(input.instagramUrl, defaultSettings.instagramUrl),
    hours: normalizeText(input.hours, defaultSettings.hours),
    footerText: normalizeText(input.footerText, defaultSettings.footerText)
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows: SiteSettingModel[] = await prisma.siteSetting.findMany();
    const dbSettings = Object.fromEntries(
      rows.map((row: SiteSettingModel) => [row.key, row.value])
    ) as Partial<Record<keyof SiteSettings, unknown>>;

    return sanitizeSettings({
      ...defaultSettings,
      ...dbSettings
    });
  } catch {
    return defaultSettings;
  }
}
