import CategoryManager from "@/components/admin/CategoryManager";
import PageHeader from "@/components/admin/PageHeader";
import { prisma } from "@/lib/prisma";
import type { CategoryModel } from "@/lib/prisma-types";

export default async function AdminCategoriesPage() {
  const categories: CategoryModel[] = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });

  return (
    <>
      <PageHeader
        title="Catégories"
        text="Organisez les sections de la carte publique et contrôlez leur ordre d’affichage."
      />
      <CategoryManager
        categories={categories.map((category: CategoryModel) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          sortOrder: category.sortOrder,
          isActive: category.isActive
        }))}
      />
    </>
  );
}
