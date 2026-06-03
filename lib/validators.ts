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
  allergens: z.string().optional(),
  isFeatured: z.boolean(),
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
  type: z.string().min(2, "Type obligatoire"),
  capacity: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int().min(0)
});

export const reservationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nom obligatoire"),
  phone: z.string().min(6, "Téléphone obligatoire"),
  date: z.string().min(4, "Date obligatoire"),
  time: z.string().min(2, "Heure obligatoire"),
  guests: z.coerce.number().int().min(1, "Au moins 1 personne"),
  message: z.string().optional(),
  status: z.enum(["nouvelle", "confirmée", "en attente", "annulée"]).default("nouvelle"),
  notes: z.string().optional()
});

export const testimonialSchema = z.object({
  id: z.string().optional(),
  author: z.string().min(2, "Nom obligatoire"),
  quote: z.string().min(8, "Avis obligatoire"),
  context: z.string().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int().min(0)
});

export const seoPageSchema = z.object({
  id: z.string().optional(),
  path: z.string().min(1, "Page obligatoire"),
  title: z.string().min(8, "Title trop court"),
  description: z.string().min(20, "Description trop courte"),
  keywords: z.string().optional(),
  ogImage: z.string().optional(),
  slug: z.string().optional()
});

export const brandAssetSchema = z.object({
  id: z.string().optional(),
  key: z.string().min(2, "Clé obligatoire"),
  label: z.string().min(2, "Libellé obligatoire"),
  value: z.string().min(1, "Valeur obligatoire"),
  type: z.enum(["text", "color", "image", "url"])
});

export const adminUserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Email invalide"),
  name: z.string().min(2, "Nom obligatoire"),
  role: z.enum(["Admin", "Manager"]),
  isActive: z.boolean()
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
export type ReservationInput = z.infer<typeof reservationSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type SeoPageInput = z.infer<typeof seoPageSchema>;
export type BrandAssetInput = z.infer<typeof brandAssetSchema>;
export type AdminUserInput = z.infer<typeof adminUserSchema>;
