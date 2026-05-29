import type { Metadata } from "next";
import ContactSection from "@/components/site/ContactSection";
import SiteChrome from "@/components/site/SiteChrome";
import SpecialtiesBand from "@/components/site/SpecialtiesBand";
import StorySection from "@/components/site/StorySection";
import { defaultSettings, getSiteSettings, type SiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "À propos | Restaurant Ali Baba El Jadida",
  description:
    "Découvrez l’histoire et l’ambiance du Restaurant Ali Baba El Jadida, adresse chaleureuse de cuisine marocaine et méditerranéenne."
};

export default async function AboutPage() {
  let settings: SiteSettings = defaultSettings;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = defaultSettings;
  }

  return (
    <SiteChrome settings={settings}>
      <main>
        <section className="moroccan-pattern bg-coffee px-5 py-20 text-center text-cream sm:py-24">
          <p className="eyebrow">À propos</p>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-none sm:text-7xl">
            Une adresse de caractère
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-cream/70">
            Un restaurant familial El Jadida avec une lecture plus contemporaine,
            chaleureuse et gastronomique.
          </p>
        </section>
        <StorySection settings={settings} />
        <SpecialtiesBand />
        <ContactSection settings={settings} />
      </main>
    </SiteChrome>
  );
}
