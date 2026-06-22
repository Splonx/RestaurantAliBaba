import MenuPdfManager from "@/components/admin/MenuPdfManager";
import PageHeader from "@/components/admin/PageHeader";
import { getPublicMenuDocument } from "@/lib/public-data";
import { getSiteUrl } from "@/lib/site-url";

export default async function AdminMenuPdfPage() {
  const menuDocument = await getPublicMenuDocument();
  const siteUrl = getSiteUrl();
  const publicFileUrl = menuDocument.fileUrl.startsWith("http")
    ? menuDocument.fileUrl
    : `${siteUrl}${menuDocument.fileUrl}`;

  return (
    <>
      <PageHeader
        title="Menu PDF"
        text="Remplacez le PDF officiel et copiez son lien public."
      />
      <MenuPdfManager
        title={menuDocument.title}
        fileUrl={menuDocument.fileUrl}
        publicFileUrl={publicFileUrl}
      />
    </>
  );
}
