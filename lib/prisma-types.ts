import type {
  Category,
  Dish,
  EventService,
  GalleryImage,
  Prisma,
  SiteSetting
} from "@prisma/client";

export type CategoryModel = Category;
export type DishModel = Dish;
export type EventServiceModel = EventService;
export type GalleryImageModel = GalleryImage;
export type SiteSettingModel = SiteSetting;

export type DishWithCategory = Prisma.DishGetPayload<{
  include: { category: true };
}>;

export type CategoryWithDishes = Prisma.CategoryGetPayload<{
  include: { dishes: true };
}>;

export type UpdatedAtRow = {
  updatedAt: Date;
} | null;

export type GalleryImageKind = "plat" | "salle" | "événement" | "ambiance";

export function toGalleryImageKind(value: string): GalleryImageKind {
  if (
    value === "plat" ||
    value === "salle" ||
    value === "événement" ||
    value === "ambiance"
  ) {
    return value;
  }

  return "ambiance";
}
