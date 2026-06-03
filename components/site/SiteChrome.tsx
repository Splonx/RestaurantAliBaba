import type { ReactNode } from "react";
import FloatingActions from "@/components/site/FloatingActions";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { getBrandAssets, getBrandAssetValue } from "@/lib/public-data";
import type { SiteSettings } from "@/lib/settings";

export default async function SiteChrome({
  settings,
  children
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  const brandAssets = await getBrandAssets();
  const logo = getBrandAssetValue(brandAssets, "logo", "AB");
  const primaryColor = getBrandAssetValue(brandAssets, "primaryColor", "#B95C3C");

  return (
    <>
      <SiteHeader settings={settings} logo={logo} primaryColor={primaryColor} />
      {children}
      <SiteFooter settings={settings} />
      <FloatingActions settings={settings} />
    </>
  );
}
