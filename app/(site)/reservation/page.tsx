import ContactSection from "@/components/site/ContactSection";
import SiteChrome from "@/components/site/SiteChrome";
import { metadataForPath } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

export const generateMetadata = () => metadataForPath("/reservation");

export default async function ReservationPage() {
  const settings = await getSiteSettings();

  return (
    <SiteChrome settings={settings}>
      <main>
        <section className="grain-overlay bg-[#10151e] px-5 py-20 text-center text-cream sm:py-24">
          <p className="eyebrow !text-sand">Réservation</p>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-none sm:text-7xl">
            Votre table à Ali Baba
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-cream/75">
            Demande de table, repas de groupe ou événement privé : laissez vos coordonnées,
            l’équipe vous confirme rapidement.
          </p>
        </section>
        <ContactSection settings={settings} />
      </main>
    </SiteChrome>
  );
}
