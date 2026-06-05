import { Gift, Medal, QrCode, Smartphone } from "lucide-react";
import LoyaltySignupForm from "@/components/site/LoyaltySignupForm";
import SiteChrome from "@/components/site/SiteChrome";
import { getSiteSettings } from "@/lib/settings";

const benefits = [
  { icon: QrCode, title: "QR code unique", text: "Présentez votre carte digitale au restaurant." },
  { icon: Medal, title: "5 achats", text: "-25% sur la prochaine commande." },
  { icon: Gift, title: "10 achats", text: "-50% puis nouveau cycle fidélité." },
  { icon: Smartphone, title: "Sur l’écran d’accueil", text: "Gardez la carte comme une app mobile." }
];

export const metadata = {
  title: "Carte fidélité | Restaurant Ali Baba El Jadida",
  description: "Créez votre carte fidélité digitale Ali Baba avec QR code."
};

export default async function LoyaltyPage() {
  const settings = await getSiteSettings();

  return (
    <SiteChrome settings={settings}>
      <main className="bg-[#F7F1E8]">
        <section className="section-shell grid min-h-[calc(100vh-5rem)] gap-8 py-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-14">
          <div>
            <p className="eyebrow">Carte fidélité digitale</p>
            <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-none text-coffee sm:text-6xl">
              Restaurant Ali Baba
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-coffee/70">
              Remplacez la carte papier par une carte virtuelle élégante avec QR code.
              Un achat validé ajoute un tampon, avec des récompenses à 5 et 10 achats.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <article key={benefit.title} className="rounded-lg border border-coffee/10 bg-white/70 p-4">
                    <Icon className="text-terracotta" size={22} aria-hidden />
                    <h2 className="mt-3 font-display text-2xl font-semibold text-coffee">
                      {benefit.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-coffee/65">{benefit.text}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div>
            <LoyaltySignupForm />
            <p className="mt-4 text-center text-xs leading-5 text-coffee/55">
              Si votre téléphone existe déjà, nous retrouvons votre carte au lieu de créer un doublon.
            </p>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
