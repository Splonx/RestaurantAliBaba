import { z } from "zod";

export const badgeSchema = z.enum(["", "populaire", "recommandé", "nouveau"]);

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nom obligatoire"),
  slug: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0),
  isActive: z.boolean()
});

export const dishSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nom obligatoire"),
  description: z.string().min(8, "Description obligatoire"),
  price: z.string().optional(),
  imageUrl: z.string().optional(),
  categoryId: z.string().min(1, "Catégorie obligatoire"),
  badge: badgeSchema.optional(),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int().min(0)
});

export const gallerySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Titre obligatoire"),
  imageUrl: z.string().optional(),
  alt: z.string().min(4, "Texte alternatif obligatoire"),
  type: z.enum(["plat", "salle", "événement", "ambiance"]),
  isFeatured: z.boolean(),
  sortOrder: z.coerce.number().int().min(0)
});

export const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Titre obligatoire"),
  description: z.string().min(8, "Description obligatoire"),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int().min(0)
});

export const settingsSchema = z.object({
  heroTitle: z.string().min(2),
  heroSubtitle: z.string().min(10),
  aboutText: z.string().min(20),
  phone: z.string().min(6),
  landline: z.string().min(6),
  whatsapp: z.string().min(8),
  address: z.string().min(8),
  instagram: z.string().min(2),
  instagramUrl: z.string().url(),
  hours: z.string().min(4),
  footerText: z.string().min(8)
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type DishInput = z.infer<typeof dishSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
