import type { ReactNode } from "react";
import FloatingActions from "@/components/site/FloatingActions";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import type { SiteSettings } from "@/lib/settings";

export default function SiteChrome({
  settings,
  children
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader settings={settings} />
      {children}
      <SiteFooter settings={settings} />
      <FloatingActions settings={settings} />
    </>
  );
}
