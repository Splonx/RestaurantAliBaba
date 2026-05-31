import MenuManager from "@/components/admin/MenuManager";
import PageHeader from "@/components/admin/PageHeader";
import { prisma } from "@/lib/prisma";
import type { CategoryModel, DishWithCategory } from "@/lib/prisma-types";

export default async function AdminMenuPage() {
  const dishesQuery: Promise<DishWithCategory[]> = prisma.dish.findMany({
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });
  const categoriesQuery: Promise<CategoryModel[]> = prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });
  const [dishes, categories] = await Promise.all([
    dishesQuery,
    categoriesQuery
  ]);

  return (
    <>
      <PageHeader
        title="Gestion du menu"
        text="Ajoutez, modifiez, désactivez et réordonnez les plats. Les prix vides apparaissent comme “Disponible au restaurant” sur le site public."
      />
      <MenuManager
        dishes={dishes.map((dish: DishWithCategory) => ({
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
        categories={categories.map((category: CategoryModel) => ({
          id: category.id,
          name: category.name
        }))}
      />
    </>
  );
}
