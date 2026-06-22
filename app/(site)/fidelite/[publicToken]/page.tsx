import QRCode from "qrcode";
import { Gift, MessageCircle, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import LoyaltyCardMemory from "@/components/site/LoyaltyCardMemory";
import InstallPromptButton from "@/components/site/InstallPromptButton";
import SiteChrome from "@/components/site/SiteChrome";
import { formatDateTime } from "@/lib/format";
import { getCardByPublicToken } from "@/lib/loyalty";
import { getSiteSettings } from "@/lib/settings";
import { getSiteUrl } from "@/lib/site-url";
import { createWhatsAppUrl } from "@/lib/whatsapp";

function rewardLabel(type: string) {
  return type === "DISCOUNT_50" ? "-50%" : "-25%";
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ publicToken: string }>;
}) {
  const { publicToken } = await params;
  const card = await getCardByPublicToken(publicToken);
  return {
    title: card ? `Carte fidélité ${card.firstName} | Ali Baba` : "Carte fidélité | Ali Baba",
    manifest: `/fidelite/${publicToken}/manifest.webmanifest`,
    appleWebApp: {
      capable: true,
      title: card ? `Ali Baba - ${card.firstName}` : "Ali Baba",
      statusBarStyle: "black-translucent"
    }
  };
}

export default async function LoyaltyCardPage({
  params
}: {
  params: Promise<{ publicToken: string }>;
}) {
  const { publicToken } = await params;
  const [settings, card] = await Promise.all([getSiteSettings(), getCardByPublicToken(publicToken)]);
  if (!card) notFound();

  const cardUrl = `${getSiteUrl()}/fidelite/${card.publicToken}`;
  const qrCode = await QRCode.toDataURL(cardUrl, {
    margin: 1,
    width: 320,
    color: {
      dark: "#2B1B15",
      light: "#F7F1E8"
    }
  });
  const availableRewards = card.rewards.filter((reward) => reward.status === "AVAILABLE");
  const progress = Math.min(card.stampCount, 10);
  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp,
    `Bonjour Ali Baba, voici ma carte fidélité : ${cardUrl}`
  );

  return (
    <SiteChrome settings={settings}>
      <LoyaltyCardMemory publicToken={card.publicToken} />
      <main className="bg-[#F7F1E8] py-8 sm:py-12">
        <section className="section-shell grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="rounded-lg bg-[#2B1B15] p-5 text-cream shadow-soft sm:p-7">
            <div className="rounded-lg border border-[#B8793D]/45 bg-[#2B1B15] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D6B98D]">
                    Carte fidélité
                  </p>
                  <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">
                    {card.firstName} {card.lastName ?? ""}
                  </h1>
                </div>
                <div className="rounded-lg bg-[#B95C3C] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em]">
                  {card.status === "ACTIVE" ? "Active" : "Bloquée"}
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-[#F7F1E8] p-4">
                <img src={qrCode} alt="QR code de la carte fidélité" className="mx-auto h-auto w-full max-w-[320px]" />
              </div>
              <p className="mt-4 text-center text-sm font-semibold text-[#D6B98D]">
                Présentez ce QR code au restaurant
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <section className="rounded-lg bg-cream p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="eyebrow">Progression</p>
                  <h2 className="mt-2 font-display text-4xl font-semibold text-coffee">
                    {progress}/10 achats
                  </h2>
                </div>
                <p className="text-sm font-semibold text-coffee/60">
                  Cycle {card.cycleNumber} · {card.lifetimePurchases} achats au total
                </p>
              </div>
              <div className="mt-5 grid grid-cols-10 gap-2">
                {Array.from({ length: 10 }, (_, index) => {
                  const active = index < progress;
                  const milestone = index === 4 || index === 9;
                  return (
                    <div
                      key={index}
                      className={`h-9 rounded-lg border text-center text-xs font-bold leading-9 ${
                        active
                          ? "border-terracotta bg-terracotta text-cream"
                          : "border-coffee/10 bg-white text-coffee/35"
                      } ${milestone ? "ring-2 ring-copper/35" : ""}`}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Milestone label="5 achats" value="-25%" active={progress >= 5} />
                <Milestone label="10 achats" value="-50%" active={progress >= 10} />
              </div>
            </section>

            <section className="rounded-lg bg-white p-5 shadow-soft sm:p-6">
              <div className="flex items-center gap-3">
                <Gift className="text-terracotta" size={23} aria-hidden />
                <h2 className="font-display text-3xl font-semibold text-coffee">Récompense</h2>
              </div>
              {availableRewards.length > 0 ? (
                <div className="mt-4 grid gap-3">
                  {availableRewards.map((reward) => (
                    <p key={reward.id} className="rounded-lg bg-olive/10 px-4 py-3 text-sm font-semibold text-olive">
                      {rewardLabel(reward.type)} disponible sur la prochaine commande
                    </p>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-coffee/65">
                  Continuez vos achats pour débloquer la prochaine récompense.
                </p>
              )}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InstallPromptButton />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-olive px-4 py-3 text-sm font-bold text-cream"
                >
                  <MessageCircle size={17} aria-hidden />
                  WhatsApp restaurant
                </a>
              </div>
            </section>

            <section className="rounded-lg bg-cream p-5 shadow-soft sm:p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-copper" size={22} aria-hidden />
                <h2 className="font-display text-3xl font-semibold text-coffee">Historique récent</h2>
              </div>
              <div className="mt-4 divide-y divide-coffee/10">
                {card.transactions.slice(0, 6).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="font-semibold text-coffee">{transaction.type.replaceAll("_", " ")}</span>
                    <span className="text-right text-coffee/55">{formatDateTime(transaction.createdAt)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-coffee/55">
                Une récompense ne peut être utilisée qu’une seule fois. Après utilisation du -50%,
                le compteur revient à 0 et un nouveau cycle démarre.
              </p>
            </section>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}

function Milestone({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className={`rounded-lg border px-4 py-3 ${active ? "border-olive bg-olive/10" : "border-coffee/10 bg-white"}`}>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-coffee/55">{label}</p>
      <p className={`mt-1 font-display text-3xl font-semibold ${active ? "text-olive" : "text-coffee"}`}>
        {value}
      </p>
    </div>
  );
}
