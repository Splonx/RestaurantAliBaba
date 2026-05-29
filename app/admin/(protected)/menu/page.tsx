import MenuManager from "@/components/admin/MenuManager";
import PageHeader from "@/components/admin/PageHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminMenuPage() {
  const [dishes, categories] = await Promise.all([
    prisma.dish.findMany({
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
    }),
    prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] })
  ]);

  return (
    <>
      <PageHeader
        title="Gestion du menu"
        text="Ajoutez, modifiez, désactivez et réordonnez les plats. Les prix vides apparaissent comme “Prix à confirmer” sur le site public."
      />
      <MenuManager
        dishes={dishes.map((dish) => ({
          id: dish.id,
          name: dish.name,
          description: dish.description,
          price: dish.price,
          imageUrl: dish.imageUrl,
          categoryId: dish.categoryId,
          categoryName: dish.category.name,
          badge: dish.badge,
          isActive: dish.isActive,
          sortOrder: dish.sortOrder
        }))}
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name
        }))}
      />
    </>
  );
}
