import QRCode from "qrcode";
import MenuPdfManager from "@/components/admin/MenuPdfManager";
import PageHeader from "@/components/admin/PageHeader";
import { getPublicMenuDocument } from "@/lib/public-data";
import { getSiteUrl } from "@/lib/site-url";

export default async function AdminMenuPdfPage() {
  const menuDocument = await getPublicMenuDocument();
  const siteUrl = getSiteUrl();
  const menuUrl = `${siteUrl}/menu`;
  const publicFileUrl = menuDocument.fileUrl.startsWith("http")
    ? menuDocument.fileUrl
    : `${siteUrl}${menuDocument.fileUrl}`;
  const qrCode = await QRCode.toDataURL(menuUrl, {
    margin: 1,
    width: 260,
    color: {
      dark: "#2B1B15",
      light: "#F7F1E8"
    }
  });

  return (
    <>
      <PageHeader
        title="Menu PDF & QR"
        text="Remplacez le PDF officiel, copiez son lien public et téléchargez le QR code qui ouvre la page menu."
      />
      <MenuPdfManager
        title={menuDocument.title}
        fileUrl={menuDocument.fileUrl}
        publicFileUrl={publicFileUrl}
        menuUrl={menuUrl}
        qrCode={qrCode}
      />
    </>
  );
}
