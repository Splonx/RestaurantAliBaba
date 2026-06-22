import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function getConnectionString() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required before importing the PDF menu.");
  }
  return databaseUrl;
}

const menuSource = JSON.parse(
  await readFile(join(process.cwd(), "data", "ali-baba-menu.json"), "utf8")
);

const adapter = new PrismaPg(
  new Pool({
    connectionString: getConnectionString()
  })
);

const prisma = new PrismaClient({ adapter });

async function upsertMenuDocument() {
  await prisma.menuDocument.updateMany({
    where: { isActive: true },
    data: { isActive: false }
  });

  const existing = await prisma.menuDocument.findFirst({
    where: { fileUrl: menuSource.document.fileUrl }
  });

  if (existing) {
    await prisma.menuDocument.update({
      where: { id: existing.id },
      data: {
        title: menuSource.document.title,
        fileUrl: menuSource.document.fileUrl,
        isActive: true,
        uploadedAt: new Date()
      }
    });
    return;
  }

  await prisma.menuDocument.create({
    data: {
      title: menuSource.document.title,
      fileUrl: menuSource.document.fileUrl,
      isActive: true
    }
  });
}

async function upsertCategoriesAndDishes() {
  let dishCount = 0;

  for (const category of menuSource.categories) {
    const savedCategory = await prisma.category.upsert({
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

    for (const dish of category.dishes) {
      const existing = await prisma.dish.findFirst({
        where: {
          name: dish.name,
          categoryId: savedCategory.id
        }
      });

      const data = {
        name: dish.name,
        description: dish.description,
        price: dish.price,
        imageUrl: dish.imageUrl,
        badge: dish.badge ?? null,
        allergens: dish.allergens ?? null,
        isFeatured: Boolean(dish.badge),
        isActive: true,
        sortOrder: dish.sortOrder,
        categoryId: savedCategory.id
      };

      if (existing) {
        await prisma.dish.update({
          where: { id: existing.id },
          data
        });
      } else {
        await prisma.dish.create({ data });
      }

      dishCount += 1;
    }
  }

  return dishCount;
}

async function main() {
  await upsertMenuDocument();
  const dishCount = await upsertCategoriesAndDishes();
  console.log(`Imported ${dishCount} menu items from PDF source.`);
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
