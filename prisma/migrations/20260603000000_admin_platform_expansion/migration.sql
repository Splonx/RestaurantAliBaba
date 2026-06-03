ALTER TABLE "Dish" ADD COLUMN "allergens" TEXT;
ALTER TABLE "Dish" ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "EventService" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'événement privé';
ALTER TABLE "EventService" ADD COLUMN "capacity" TEXT;

CREATE TABLE "Reservation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "time" TEXT NOT NULL,
  "guests" INTEGER NOT NULL,
  "message" TEXT,
  "status" TEXT NOT NULL DEFAULT 'nouvelle',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Testimonial" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "author" TEXT NOT NULL,
  "quote" TEXT NOT NULL,
  "context" TEXT,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "SeoPage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "path" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "keywords" TEXT,
  "ogImage" TEXT,
  "slug" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "SeoPage_path_key" ON "SeoPage"("path");

CREATE TABLE "BrandAsset" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "key" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'text',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "BrandAsset_key_key" ON "BrandAsset"("key");

CREATE TABLE "AdminUser" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'Admin',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
