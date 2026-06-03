import BrandingManager from "@/components/admin/BrandingManager";
import PageHeader from "@/components/admin/PageHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminBrandingPage() {
  const assets = await prisma.brandAsset.findMany({
    orderBy: { label: "asc" }
  });

  return (
    <>
      <PageHeader
        title="Branding"
        text="Gérez logo, favicon, couleurs et image hero sans redéploiement. Les uploads passent par Cloudinary si configuré."
      />
      <BrandingManager
        assets={assets.map((asset) => ({
          id: asset.id,
          key: asset.key,
          label: asset.label,
          value: asset.value,
          type: asset.type as "text" | "color" | "image" | "url"
        }))}
      />
    </>
  );
}
