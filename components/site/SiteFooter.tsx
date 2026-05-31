import { Clock3, Instagram, MapPin, Phone } from "lucide-react";
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
    <footer className="bg-[#10141b] py-14 text-cream">
      <div className="section-shell grid gap-10 lg:grid-cols-[1fr_0.65fr_1fr]">
        <div>
          <Link href="/" className="focus-ring inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-copper font-bold text-cream">
              AB
            </span>
            <span className="font-display text-4xl font-semibold leading-none">Ali Baba</span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-cream/70">{settings.footerText}</p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sand">Navigation</p>
          <div className="mt-4 grid gap-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring text-sm text-cream/70 transition hover:text-sand"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4 text-sm text-cream/75">
          <p className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-sand" aria-hidden />
            <span>{settings.address}</span>
          </p>
          <a
            href={`tel:${settings.phone.replaceAll(".", "")}`}
            className="focus-ring flex items-start gap-3 transition hover:text-sand"
          >
            <Phone size={18} className="mt-0.5 shrink-0 text-sand" aria-hidden />
            <span>{settings.phone}</span>
          </a>
          <p className="flex items-start gap-3">
            <Clock3 size={18} className="mt-0.5 shrink-0 text-sand" aria-hidden />
            <span>{settings.hours}</span>
          </p>
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring flex items-start gap-3 transition hover:text-sand"
          >
            <Instagram size={18} className="mt-0.5 shrink-0 text-sand" aria-hidden />
            <span>{settings.instagram}</span>
          </a>
        </div>
      </div>

      <div className="section-shell mt-10 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.12em] text-cream/45">
        © {new Date().getFullYear()} Restaurant Ali Baba El Jadida
      </div>
    </footer>
  );
}
