import { Instagram, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/settings";

const nav = [
  { href: "/", label: "Accueil" },
  { href: "/menu", label: "Menu" },
  { href: "/galerie", label: "Galerie" },
  { href: "/evenements", label: "Événements" },
  { href: "/contact", label: "Contact" }
];

export default function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-coffee py-14 text-cream">
      <div className="section-shell grid gap-10 md:grid-cols-[1.15fr_0.7fr_1fr]">
        <div>
          <Link href="/" className="focus-ring inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-terracotta font-bold">AB</span>
            <span className="font-display text-4xl font-semibold">Ali Baba</span>
          </Link>
          <p className="mt-5 max-w-md leading-7 text-cream/70">{settings.footerText}</p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sand">Navigation</p>
          <div className="mt-5 grid gap-3">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="focus-ring text-sm text-cream/70 hover:text-sand">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sand">Contact</p>
          <div className="mt-5 space-y-4 text-sm text-cream/70">
            <p className="flex gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-sand" aria-hidden />{settings.address}</p>
            <a href={`tel:${settings.phone.replaceAll(".", "")}`} className="focus-ring flex gap-3 hover:text-sand"><Phone size={17} className="mt-0.5 shrink-0 text-sand" aria-hidden />{settings.phone}</a>
            <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="focus-ring flex gap-3 hover:text-sand"><Instagram size={17} className="mt-0.5 shrink-0 text-sand" aria-hidden />{settings.instagram}</a>
          </div>
        </div>
      </div>
      <div className="section-shell mt-10 border-t border-cream/10 pt-6 text-sm text-cream/50">
        © {new Date().getFullYear()} Restaurant Ali Baba El Jadida.
      </div>
    </footer>
  );
}
