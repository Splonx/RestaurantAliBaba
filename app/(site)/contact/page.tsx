import type { Metadata } from "next";
import ContactSection from "@/components/site/ContactSection";
import SiteChrome from "@/components/site/SiteChrome";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact & réservation | Restaurant Ali Baba El Jadida",
  description:
    "Réservez au Restaurant Ali Baba El Jadida par WhatsApp ou téléphone. Adresse : Route de Casablanca n°8, El Jadida."
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <SiteChrome settings={settings}>
      <main>
        <ContactSection settings={settings} />
      </main>
    </SiteChrome>
  );
}
