import { NextResponse } from "next/server";
import { getCardByPublicToken } from "@/lib/loyalty";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ publicToken: string }> }
) {
  const { publicToken } = await params;
  const card = await getCardByPublicToken(publicToken);
  const cardName = card ? `${card.firstName} ${card.lastName ?? ""}`.trim() : "Carte fidélité";
  const startUrl = `/fidelite/${publicToken}`;

  return NextResponse.json({
    name: `Carte fidélité Ali Baba - ${cardName}`,
    short_name: "Ali Baba",
    description: "Carte fidélité digitale Restaurant Ali Baba El Jadida.",
    start_url: startUrl,
    scope: startUrl,
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
  });
}
