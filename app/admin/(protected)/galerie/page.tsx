import GalleryManager from "@/components/admin/GalleryManager";
import PageHeader from "@/components/admin/PageHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });

  return (
    <>
      <PageHeader
        title="Galerie"
        text="Gérez les images de plats, salle, ambiance et événements. Les images mises en avant nourrissent le rendu éditorial du site."
      />
      <GalleryManager
        images={images.map((image) => ({
          id: image.id,
          title: image.title,
          imageUrl: image.imageUrl,
          alt: image.alt,
          type: image.type as "plat" | "salle" | "événement" | "ambiance",
          isFeatured: image.isFeatured,
          sortOrder: image.sortOrder
        }))}
      />
    </>
  );
}
