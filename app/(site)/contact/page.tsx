import type { Metadata } from "next";
import ContactSection from "@/components/site/ContactSection";
import SiteChrome from "@/components/site/SiteChrome";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact & réservation | Restaurant Ali Baba El Jadida",
  description:
    "Réservation rapide Restaurant Ali Baba El Jadida par WhatsApp ou téléphone."
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
