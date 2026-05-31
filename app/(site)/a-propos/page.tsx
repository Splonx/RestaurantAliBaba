import type { Metadata } from "next";
import ContactSection from "@/components/site/ContactSection";
import SiteChrome from "@/components/site/SiteChrome";
import SpecialtiesBand from "@/components/site/SpecialtiesBand";
import StorySection from "@/components/site/StorySection";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "À propos | Restaurant Ali Baba El Jadida",
  description:
    "Découvrez l’histoire et l’ambiance du Restaurant Ali Baba El Jadida, adresse chaleureuse de cuisine marocaine et méditerranéenne."
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <SiteChrome settings={settings}>
      <main>
        <section className="grain-overlay bg-[#10151e] px-5 py-20 text-center text-cream sm:py-24">
          <p className="eyebrow !text-sand">La maison</p>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-none sm:text-7xl">
            Une adresse d’El Jadida qui rassemble
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-cream/75">
            Ali Baba combine esprit méditerranéen, chaleur marocaine et accueil pensé
            pour les repas à plusieurs.
          </p>
        </section>
        <StorySection settings={settings} />
        <SpecialtiesBand />
        <ContactSection settings={settings} />
      </main>
    </SiteChrome>
  );
}
