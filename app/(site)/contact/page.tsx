import ContactSection from "@/components/site/ContactSection";
import SiteChrome from "@/components/site/SiteChrome";
import { metadataForPath } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

export const generateMetadata = () => metadataForPath("/contact");

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
