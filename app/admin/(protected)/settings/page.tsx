import PageHeader from "@/components/admin/PageHeader";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        title="Contenu site"
        text="Modifiez les textes principaux, coordonnées, horaires, WhatsApp et informations de contact visibles sur le site public."
      />
      <SettingsForm settings={settings} />
    </>
  );
}
