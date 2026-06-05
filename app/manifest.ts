import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Restaurant Ali Baba Fidélité",
    short_name: "Ali Baba",
    description: "Carte fidélité digitale Restaurant Ali Baba El Jadida.",
    start_url: "/fidelite",
    display: "standalone",
    background_color: "#F7F1E8",
    theme_color: "#B95C3C",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml"
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml"
      }
    ]
  };
}
