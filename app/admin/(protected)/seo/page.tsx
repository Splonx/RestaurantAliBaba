import SeoManager from "@/components/admin/SeoManager";
import PageHeader from "@/components/admin/PageHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminSeoPage() {
  const pages = await prisma.seoPage.findMany({
    orderBy: { path: "asc" }
  });

  return (
    <>
      <PageHeader
        title="SEO"
        text="Contrôlez les title, descriptions, keywords, images sociales et slugs pour chaque page publique."
      />
      <SeoManager
        pages={pages.map((page) => ({
          id: page.id,
          path: page.path,
          title: page.title,
          description: page.description,
          keywords: page.keywords,
          ogImage: page.ogImage,
          slug: page.slug
        }))}
      />
    </>
  );
}
