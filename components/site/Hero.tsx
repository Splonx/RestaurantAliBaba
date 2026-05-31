"use client";

import { motion } from "framer-motion";
import { Clock3, MapPin, MessageCircle, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type { SiteSettings } from "@/lib/settings";
import { createWhatsAppUrl, defaultReservationMessage } from "@/lib/whatsapp";

const fallbackHero =
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2200&q=80";

export default function Hero({
  settings,
  imageUrl = fallbackHero
}: {
  settings: SiteSettings;
  imageUrl?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#10141b] text-cream">
      <div className="relative min-h-[calc(100svh-5rem)]">
        <Image
          src={imageUrl}
          alt="Restaurant Ali Baba El Jadida"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#10141b] via-[#10141b]/80 to-[#10141b]/45" />
        <div className="grain-overlay absolute inset-0 opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#10141b] to-transparent" />

        <div className="section-shell relative flex min-h-[calc(100svh-5rem)] items-end py-16 md:items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <p className="inline-flex items-center rounded-full border border-white/25 bg-black/25 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-sand backdrop-blur">
              El Jadida • Poissons • Grillades • Groupes
            </p>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.9] sm:text-7xl lg:text-8xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/85 sm:text-xl">
              {settings.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={createWhatsAppUrl(settings.whatsapp, defaultReservationMessage)}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-copper px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-terracotta"
              >
                <MessageCircle size={18} aria-hidden />
                Réserver maintenant
              </a>
              <a
                href={`tel:${settings.phone.replaceAll(".", "")}`}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-black/20 px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:border-sand hover:text-sand"
              >
                <Phone size={18} aria-hidden />
                Appeler
              </a>
            </div>

            <div className="mt-10 grid gap-3 text-sm sm:grid-cols-3">
              <InfoPill icon={Clock3} text={settings.hours} />
              <InfoPill icon={MapPin} text="N1, Route de Casablanca, El Jadida" />
              <InfoPill icon={MessageCircle} text="Réponse rapide sur WhatsApp" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InfoPill({
  icon: Icon,
  text
}: {
  icon: LucideIcon;
  text: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/25 px-3 py-3 text-cream/90 backdrop-blur">
      <Icon size={16} className="shrink-0 text-sand" aria-hidden />
      <span className="line-clamp-2">{text}</span>
    </div>
  );
}
