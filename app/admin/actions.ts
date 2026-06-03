"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, createAdminSession, requireAdmin, verifyAdminCredentials } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { saveUploadedImage } from "@/lib/uploads";
import {
  adminUserSchema,
  brandAssetSchema,
  categorySchema,
  dishSchema,
  eventSchema,
  gallerySchema,
  reservationSchema,
  seoPageSchema,
  settingsSchema,
  testimonialSchema
} from "@/lib/validators";

type ActionState = {
  ok: boolean;
  message: string;
};

function checkbox(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalString(value: string) {
  return value.trim().length > 0 ? value.trim() : null;
}

async function resolveImage(formData: FormData, folder: string) {
  const uploaded = await saveUploadedImage(formData.get("imageFile") as File | null, folder);
  if (uploaded) return uploaded;
  return optionalString(stringValue(formData, "imageUrl"));
}

function refreshAdmin(paths: string[]) {
  for (const path of paths) revalidatePath(path);
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/galerie");
  revalidatePath("/evenements");
  revalidatePath("/contact");
  revalidatePath("/a-propos");
  revalidatePath("/reservation");
}

export async function loginAction(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const username = stringValue(formData, "username");
  const password = stringValue(formData, "password");

  if (!verifyAdminCredentials(username, password)) {
    return {
      ok: false,
      message: "Identifiants incorrects ou variables d’environnement manquantes."
    };
  }

  await createAdminSession(username);
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function saveCategoryAction(formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const parsed = categorySchema.parse({
      id: stringValue(formData, "id") || undefined,
      name: stringValue(formData, "name"),
      slug: stringValue(formData, "slug"),
      sortOrder: stringValue(formData, "sortOrder") || "0",
      isActive: checkbox(formData, "isActive")
    });

    const slug = slugify(parsed.slug || parsed.name);
    if (parsed.id) {
      await prisma.category.update({
        where: { id: parsed.id },
        data: {
          name: parsed.name,
          slug,
          sortOrder: parsed.sortOrder,
          isActive: parsed.isActive
        }
      });
    } else {
      await prisma.category.create({
        data: {
          name: parsed.name,
          slug,
          sortOrder: parsed.sortOrder,
          isActive: parsed.isActive
        }
      });
    }

    refreshAdmin(["/admin/categories", "/admin/menu", "/admin/dashboard"]);
    return { ok: true, message: "Catégorie enregistrée." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur catégorie." };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionState> {
  await requireAdmin();
  try {
    const dishes = await prisma.dish.count({ where: { categoryId: id } });
    if (dishes > 0) {
      return {
        ok: false,
        message: "Impossible de supprimer une catégorie contenant des plats."
      };
    }
    await prisma.category.delete({ where: { id } });
    refreshAdmin(["/admin/categories", "/admin/dashboard"]);
    return { ok: true, message: "Catégorie supprimée." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur suppression." };
  }
}

export async function saveDishAction(formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const imageUrl = await resolveImage(formData, "menu");
    const parsed = dishSchema.parse({
      id: stringValue(formData, "id") || undefined,
      name: stringValue(formData, "name"),
      description: stringValue(formData, "description"),
      price: stringValue(formData, "price"),
      imageUrl: imageUrl ?? "",
      categoryId: stringValue(formData, "categoryId"),
      badge: stringValue(formData, "badge"),
      allergens: stringValue(formData, "allergens"),
      isFeatured: checkbox(formData, "isFeatured"),
      isActive: checkbox(formData, "isActive"),
      sortOrder: stringValue(formData, "sortOrder") || "0"
    });

    const data = {
      name: parsed.name,
      description: parsed.description,
      price: optionalString(parsed.price ?? ""),
      imageUrl: optionalString(parsed.imageUrl ?? ""),
      categoryId: parsed.categoryId,
      badge: optionalString(parsed.badge ?? ""),
      allergens: optionalString(parsed.allergens ?? ""),
      isFeatured: parsed.isFeatured,
      isActive: parsed.isActive,
      sortOrder: parsed.sortOrder
    };

    if (parsed.id) {
      await prisma.dish.update({ where: { id: parsed.id }, data });
    } else {
      await prisma.dish.create({ data });
    }

    refreshAdmin(["/admin/menu", "/admin/dashboard"]);
    return { ok: true, message: "Plat enregistré." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur plat." };
  }
}

export async function deleteDishAction(id: string): Promise<ActionState> {
  await requireAdmin();
  try {
    await prisma.dish.delete({ where: { id } });
    refreshAdmin(["/admin/menu", "/admin/dashboard"]);
    return { ok: true, message: "Plat supprimé." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur suppression." };
  }
}

export async function saveGalleryImageAction(formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const imageUrl = await resolveImage(formData, "gallery");
    const parsed = gallerySchema.parse({
      id: stringValue(formData, "id") || undefined,
      title: stringValue(formData, "title"),
      imageUrl: imageUrl ?? "",
      alt: stringValue(formData, "alt"),
      type: stringValue(formData, "type"),
      isFeatured: checkbox(formData, "isFeatured"),
      sortOrder: stringValue(formData, "sortOrder") || "0"
    });

    if (!parsed.imageUrl) {
      return { ok: false, message: "Ajoutez une image ou une URL d’image." };
    }

    const data = {
      title: parsed.title,
      imageUrl: parsed.imageUrl,
      alt: parsed.alt,
      type: parsed.type,
      isFeatured: parsed.isFeatured,
      sortOrder: parsed.sortOrder
    };

    if (parsed.id) {
      await prisma.galleryImage.update({ where: { id: parsed.id }, data });
    } else {
      await prisma.galleryImage.create({ data });
    }

    refreshAdmin(["/admin/galerie", "/admin/dashboard"]);
    return { ok: true, message: "Image enregistrée." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur galerie." };
  }
}

export async function deleteGalleryImageAction(id: string): Promise<ActionState> {
  await requireAdmin();
  try {
    await prisma.galleryImage.delete({ where: { id } });
    refreshAdmin(["/admin/galerie", "/admin/dashboard"]);
    return { ok: true, message: "Image supprimée." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur suppression." };
  }
}

export async function saveEventAction(formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const imageUrl = await resolveImage(formData, "events");
    const parsed = eventSchema.parse({
      id: stringValue(formData, "id") || undefined,
      title: stringValue(formData, "title"),
      description: stringValue(formData, "description"),
      type: stringValue(formData, "type") || "événement privé",
      capacity: stringValue(formData, "capacity"),
      imageUrl: imageUrl ?? "",
      isActive: checkbox(formData, "isActive"),
      sortOrder: stringValue(formData, "sortOrder") || "0"
    });

    const data = {
      title: parsed.title,
      description: parsed.description,
      type: parsed.type,
      capacity: optionalString(parsed.capacity ?? ""),
      imageUrl: optionalString(parsed.imageUrl ?? ""),
      isActive: parsed.isActive,
      sortOrder: parsed.sortOrder
    };

    if (parsed.id) {
      await prisma.eventService.update({ where: { id: parsed.id }, data });
    } else {
      await prisma.eventService.create({ data });
    }

    refreshAdmin(["/admin/evenements", "/admin/dashboard"]);
    return { ok: true, message: "Événement enregistré." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur événement." };
  }
}

export async function deleteEventAction(id: string): Promise<ActionState> {
  await requireAdmin();
  try {
    await prisma.eventService.delete({ where: { id } });
    refreshAdmin(["/admin/evenements", "/admin/dashboard"]);
    return { ok: true, message: "Événement supprimé." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur suppression." };
  }
}

export async function saveSettingsAction(formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const parsed = settingsSchema.parse({
      heroTitle: stringValue(formData, "heroTitle"),
      heroSubtitle: stringValue(formData, "heroSubtitle"),
      aboutText: stringValue(formData, "aboutText"),
      phone: stringValue(formData, "phone"),
      landline: stringValue(formData, "landline"),
      whatsapp: stringValue(formData, "whatsapp"),
      address: stringValue(formData, "address"),
      instagram: stringValue(formData, "instagram"),
      instagramUrl: stringValue(formData, "instagramUrl"),
      hours: stringValue(formData, "hours"),
      footerText: stringValue(formData, "footerText")
    });

    await prisma.$transaction(
      Object.entries(parsed).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        })
      )
    );

    refreshAdmin(["/admin/settings", "/admin/dashboard"]);
    return { ok: true, message: "Contenu du site enregistré." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur réglages." };
  }
}

export async function createReservationAction(formData: FormData): Promise<ActionState> {
  try {
    const parsed = reservationSchema.parse({
      name: stringValue(formData, "name"),
      phone: stringValue(formData, "phone"),
      date: stringValue(formData, "date"),
      time: stringValue(formData, "time"),
      guests: stringValue(formData, "guests"),
      message: stringValue(formData, "message"),
      status: "nouvelle",
      notes: ""
    });

    await prisma.reservation.create({
      data: {
        name: parsed.name,
        phone: parsed.phone,
        date: parsed.date,
        time: parsed.time,
        guests: parsed.guests,
        message: optionalString(parsed.message ?? "")
      }
    });

    revalidatePath("/admin/reservations");
    return { ok: true, message: "Demande envoyée. Le restaurant vous recontacte rapidement." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur réservation." };
  }
}

export async function updateReservationAction(formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const parsed = reservationSchema.parse({
      id: stringValue(formData, "id"),
      name: stringValue(formData, "name"),
      phone: stringValue(formData, "phone"),
      date: stringValue(formData, "date"),
      time: stringValue(formData, "time"),
      guests: stringValue(formData, "guests"),
      message: stringValue(formData, "message"),
      status: stringValue(formData, "status") || "nouvelle",
      notes: stringValue(formData, "notes")
    });
    if (!parsed.id) return { ok: false, message: "Réservation introuvable." };

    await prisma.reservation.update({
      where: { id: parsed.id },
      data: {
        name: parsed.name,
        phone: parsed.phone,
        date: parsed.date,
        time: parsed.time,
        guests: parsed.guests,
        message: optionalString(parsed.message ?? ""),
        status: parsed.status,
        notes: optionalString(parsed.notes ?? "")
      }
    });

    refreshAdmin(["/admin/reservations", "/admin/dashboard"]);
    return { ok: true, message: "Réservation mise à jour." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur réservation." };
  }
}

export async function deleteReservationAction(id: string): Promise<ActionState> {
  await requireAdmin();
  try {
    await prisma.reservation.delete({ where: { id } });
    refreshAdmin(["/admin/reservations", "/admin/dashboard"]);
    return { ok: true, message: "Réservation supprimée." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur suppression." };
  }
}

export async function saveTestimonialAction(formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const parsed = testimonialSchema.parse({
      id: stringValue(formData, "id") || undefined,
      author: stringValue(formData, "author"),
      quote: stringValue(formData, "quote"),
      context: stringValue(formData, "context"),
      isFeatured: checkbox(formData, "isFeatured"),
      isActive: checkbox(formData, "isActive"),
      sortOrder: stringValue(formData, "sortOrder") || "0"
    });
    const data = {
      author: parsed.author,
      quote: parsed.quote,
      context: optionalString(parsed.context ?? ""),
      isFeatured: parsed.isFeatured,
      isActive: parsed.isActive,
      sortOrder: parsed.sortOrder
    };
    if (parsed.id) {
      await prisma.testimonial.update({ where: { id: parsed.id }, data });
    } else {
      await prisma.testimonial.create({ data });
    }
    refreshAdmin(["/admin/avis", "/admin/dashboard"]);
    return { ok: true, message: "Avis enregistré." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur avis." };
  }
}

export async function deleteTestimonialAction(id: string): Promise<ActionState> {
  await requireAdmin();
  try {
    await prisma.testimonial.delete({ where: { id } });
    refreshAdmin(["/admin/avis", "/admin/dashboard"]);
    return { ok: true, message: "Avis supprimé." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur suppression." };
  }
}

export async function saveSeoPageAction(formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const parsed = seoPageSchema.parse({
      id: stringValue(formData, "id") || undefined,
      path: stringValue(formData, "path"),
      title: stringValue(formData, "title"),
      description: stringValue(formData, "description"),
      keywords: stringValue(formData, "keywords"),
      ogImage: stringValue(formData, "ogImage"),
      slug: stringValue(formData, "slug")
    });
    const data = {
      path: parsed.path,
      title: parsed.title,
      description: parsed.description,
      keywords: optionalString(parsed.keywords ?? ""),
      ogImage: optionalString(parsed.ogImage ?? ""),
      slug: optionalString(parsed.slug ?? "")
    };
    if (parsed.id) {
      await prisma.seoPage.update({ where: { id: parsed.id }, data });
    } else {
      await prisma.seoPage.upsert({
        where: { path: parsed.path },
        update: data,
        create: data
      });
    }
    refreshAdmin(["/admin/seo", parsed.path]);
    return { ok: true, message: "SEO enregistré." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur SEO." };
  }
}

export async function saveBrandAssetAction(formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const uploaded = await saveUploadedImage(formData.get("imageFile") as File | null, "branding");
    const parsed = brandAssetSchema.parse({
      id: stringValue(formData, "id") || undefined,
      key: stringValue(formData, "key"),
      label: stringValue(formData, "label"),
      value: uploaded ?? stringValue(formData, "value"),
      type: stringValue(formData, "type") || "text"
    });
    const data = {
      key: parsed.key,
      label: parsed.label,
      value: parsed.value,
      type: parsed.type
    };
    if (parsed.id) {
      await prisma.brandAsset.update({ where: { id: parsed.id }, data });
    } else {
      await prisma.brandAsset.upsert({
        where: { key: parsed.key },
        update: data,
        create: data
      });
    }
    refreshAdmin(["/admin/branding", "/admin/dashboard"]);
    return { ok: true, message: "Branding enregistré." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur branding." };
  }
}

export async function saveAdminUserAction(formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const parsed = adminUserSchema.parse({
      id: stringValue(formData, "id") || undefined,
      email: stringValue(formData, "email"),
      name: stringValue(formData, "name"),
      role: stringValue(formData, "role") || "Manager",
      isActive: checkbox(formData, "isActive")
    });
    const data = {
      email: parsed.email,
      name: parsed.name,
      role: parsed.role,
      isActive: parsed.isActive
    };
    if (parsed.id) {
      await prisma.adminUser.update({ where: { id: parsed.id }, data });
    } else {
      await prisma.adminUser.create({ data });
    }
    refreshAdmin(["/admin/users", "/admin/dashboard"]);
    return { ok: true, message: "Utilisateur enregistré." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur utilisateur." };
  }
}

export async function deleteAdminUserAction(id: string): Promise<ActionState> {
  await requireAdmin();
  try {
    await prisma.adminUser.delete({ where: { id } });
    refreshAdmin(["/admin/users", "/admin/dashboard"]);
    return { ok: true, message: "Utilisateur supprimé." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Erreur suppression." };
  }
}
