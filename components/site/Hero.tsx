"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import type { SiteSettings } from "@/lib/settings";
import { createWhatsAppUrl, defaultReservationMessage } from "@/lib/whatsapp";

const fallbackHero =
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=2200&q=85";

export default function Hero({
  settings,
  imageUrl = fallbackHero
}: {
  settings: SiteSettings;
  imageUrl?: string;
}) {
  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-coffee text-cream">
      <Image src={imageUrl} alt="Ambiance raffinée du Restaurant Ali Baba El Jadida" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-coffee via-coffee/80 to-coffee/30" />
      <div className="absolute inset-0 moroccan-pattern opacity-35" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ivory to-transparent" />

      <div className="section-shell relative flex min-h-[calc(100svh-5rem)] items-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-3 rounded-lg border border-sand/35 bg-cream/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-sand backdrop-blur">
            <Sparkles size={16} aria-hidden />
            Oriental contemporain • Méditerranéen • Familial chic
          </div>
          <h1 className="mt-7 font-display text-6xl font-semibold leading-[0.92] sm:text-7xl lg:text-8xl">
            {settings.heroTitle}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-cream/80 sm:text-xl">
            {settings.heroSubtitle}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={createWhatsAppUrl(settings.whatsapp, defaultReservationMessage)} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-terracotta px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-copper">
              <MessageCircle size={18} aria-hidden />
              Réserver sur WhatsApp
            </a>
            <a href="/menu" className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-cream/25 bg-cream/10 px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-cream backdrop-blur transition hover:border-sand hover:text-sand">
              Voir la carte
              <ArrowRight size={18} aria-hidden />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
