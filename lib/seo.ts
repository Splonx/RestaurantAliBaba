import type { Metadata } from "next";
import { getSeoPage } from "@/lib/public-data";

export async function metadataForPath(path: string): Promise<Metadata> {
  const seo = await getSeoPage(path);
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.split(",").map((keyword) => keyword.trim()).filter(Boolean),
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      locale: "fr_MA",
      siteName: "Restaurant Ali Baba El Jadida",
      images: seo.ogImage
        ? [
            {
              url: seo.ogImage,
              alt: seo.title
            }
          ]
        : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined
    }
  };
}
