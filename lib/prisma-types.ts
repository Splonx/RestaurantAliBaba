import type {
  AdminUser,
  BrandAsset,
  Category,
  Dish,
  EventService,
  GalleryImage,
  LoyaltyCustomer,
  LoyaltyReward,
  LoyaltyTransaction,
  Prisma,
  Reservation,
  SeoPage,
  SiteSetting,
  Testimonial
} from "@prisma/client";

export type AdminUserModel = AdminUser;
export type BrandAssetModel = BrandAsset;
export type CategoryModel = Category;
export type DishModel = Dish;
export type EventServiceModel = EventService;
export type GalleryImageModel = GalleryImage;
export type LoyaltyCustomerModel = LoyaltyCustomer;
export type LoyaltyRewardModel = LoyaltyReward;
export type LoyaltyTransactionModel = LoyaltyTransaction;
export type ReservationModel = Reservation;
export type SeoPageModel = SeoPage;
export type SiteSettingModel = SiteSetting;
export type TestimonialModel = Testimonial;

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
