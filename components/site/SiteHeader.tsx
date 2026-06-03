"use client";

import { Menu, MessageCircle, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import type { SiteSettings } from "@/lib/settings";
import { createWhatsAppUrl, defaultReservationMessage } from "@/lib/whatsapp";

const nav = [
  { href: "/", label: "Accueil" },
  { href: "/menu", label: "Menu" },
  { href: "/galerie", label: "Galerie" },
  { href: "/evenements", label: "Événements" },
  { href: "/a-propos", label: "Maison" },
  { href: "/reservation", label: "Réserver" },
  { href: "/contact", label: "Contact" }
];

export default function SiteHeader({
  settings,
  logo,
  primaryColor
}: {
  settings: SiteSettings;
  logo: string;
  primaryColor: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reservationUrl = useMemo(
    () => createWhatsAppUrl(settings.whatsapp, defaultReservationMessage),
    [settings.whatsapp]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#11151d]/90 text-cream shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-5">
        <Link href="/" className="focus-ring flex items-center gap-3" aria-label="Retour à l'accueil">
          <span
            className="grid h-11 min-w-11 place-items-center rounded-lg px-2 font-bold text-cream"
            style={{ backgroundColor: primaryColor }}
          >
            {logo}
          </span>
          <span className="leading-none">
            <span className="block font-display text-[1.9rem] font-semibold">Ali Baba</span>
            <span className="text-[0.65rem] uppercase tracking-[0.24em] text-sand/85">
              El Jadida
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring text-sm font-semibold transition ${
                  active ? "text-sand" : "text-cream/80 hover:text-sand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${settings.phone.replaceAll(".", "")}`}
            className="focus-ring inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-cream/90 transition hover:border-sand hover:text-sand"
          >
            <Phone size={16} aria-hidden />
            {settings.phone}
          </a>
          <a
            href={reservationUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-cream transition hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            <MessageCircle size={16} aria-hidden />
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="focus-ring grid h-11 w-11 place-items-center rounded-lg border border-white/20 lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-white/10 bg-[#11151d] lg:hidden" aria-label="Navigation mobile">
          <div className="section-shell grid gap-1 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`focus-ring rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  pathname === item.href
                    ? "bg-white/10 text-sand"
                    : "text-cream/80 hover:bg-white/10 hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={reservationUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream"
            >
              <MessageCircle size={17} aria-hidden />
              Réserver sur WhatsApp
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
