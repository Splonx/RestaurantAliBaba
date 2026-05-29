"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { SiteSettings } from "@/lib/settings";
import { createWhatsAppUrl, defaultReservationMessage } from "@/lib/whatsapp";

const nav = [
  { href: "/", label: "Accueil" },
  { href: "/menu", label: "Menu" },
  { href: "/galerie", label: "Galerie" },
  { href: "/evenements", label: "Événements" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" }
];

export default function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const reservationUrl = createWhatsAppUrl(settings.whatsapp, defaultReservationMessage);

  return (
    <header className="sticky top-0 z-50 border-b border-cream/10 bg-coffee/90 text-cream shadow-lg shadow-coffee/10 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-6">
        <Link href="/" className="focus-ring flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-terracotta font-bold text-cream">
            AB
          </span>
          <span className="leading-none">
            <span className="block font-display text-3xl font-semibold">Ali Baba</span>
            <span className="text-xs uppercase tracking-[0.26em] text-sand">El Jadida</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="focus-ring text-sm font-semibold text-cream/75 transition hover:text-sand">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${settings.phone.replaceAll(".", "")}`} className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-sand transition hover:text-cream">
            <Phone size={17} aria-hidden />
            {settings.phone}
          </a>
          <a href={reservationUrl} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-lg bg-terracotta px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-cream transition hover:bg-copper">
            <MessageCircle size={17} aria-hidden />
            Réserver
          </a>
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="focus-ring grid h-11 w-11 place-items-center rounded-lg border border-cream/20 lg:hidden" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-cream/10 bg-coffee lg:hidden"
            aria-label="Navigation mobile"
          >
            <div className="section-shell grid gap-1 py-4">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="focus-ring rounded-lg px-2 py-3 font-semibold text-cream/80 hover:bg-cream/10 hover:text-cream">
                  {item.label}
                </Link>
              ))}
              <a href={reservationUrl} target="_blank" rel="noreferrer" className="focus-ring mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-terracotta px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-cream">
                <MessageCircle size={17} aria-hidden />
                Réserver sur WhatsApp
              </a>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
