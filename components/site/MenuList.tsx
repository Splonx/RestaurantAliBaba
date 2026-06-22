"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import SectionIntro from "@/components/site/SectionIntro";
import { displayPrice } from "@/lib/format";

type MenuCategory = {
  id: string;
  name: string;
  dishes: {
    id: string;
    name: string;
    description: string;
    price: string | null;
    imageUrl: string | null;
    badge: string | null;
    allergens: string | null;
  }[];
};

function toAnchor(label: string) {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function MenuList({
  categories,
  pdfUrl,
  qrCode
}: {
  categories: MenuCategory[];
  pdfUrl: string;
  qrCode: string;
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const visibleCategories = useMemo(
    () =>
      selectedCategoryId === "all"
        ? categories
        : categories.filter((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );
  const totalDishes = categories.reduce((total, category) => total + category.dishes.length, 0);

  return (
    <section className="bg-ivory py-20 sm:py-24">
      <div className="section-shell">
        <SectionIntro
          eyebrow="Carte"
          title="Menu Ali Baba El Jadida"
          text={`${totalDishes} spécialités issues du menu officiel : prix, catégories et ordre de service respectent le PDF du restaurant.`}
          align="center"
        />

        <div className="mt-8 grid gap-3 rounded-lg border border-coffee/10 bg-cream p-4 shadow-soft sm:grid-cols-[1fr_auto_auto] sm:items-center">
          <div>
            <p className="text-sm font-semibold text-coffee">Menu PDF officiel</p>
            <p className="text-xs leading-5 text-coffee/55">
              Consultez la carte originale ou scannez le QR code pour ouvrir cette page.
            </p>
          </div>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex justify-center rounded-lg bg-coffee px-4 py-3 text-sm font-bold text-cream"
          >
            Consulter le PDF
          </a>
          <div className="hidden rounded-lg bg-white p-2 sm:block">
            <img src={qrCode} alt="QR code du menu" className="h-20 w-20" />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategoryId("all")}
            className={`focus-ring rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
              selectedCategoryId === "all"
                ? "border-coffee bg-coffee text-cream"
                : "border-coffee/15 bg-white text-coffee hover:border-copper hover:text-copper"
            }`}
          >
            Tout
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`focus-ring rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
                selectedCategoryId === category.id
                  ? "border-coffee bg-coffee text-cream"
                  : "border-coffee/15 bg-white text-coffee hover:border-copper hover:text-copper"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="mt-12 space-y-10">
          {visibleCategories.map((category) => (
            <section
              key={category.id}
              id={toAnchor(category.name)}
              className="rounded-lg border border-coffee/10 bg-cream p-5 shadow-soft sm:p-7"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-coffee/10 pb-4">
                <h2 className="font-display text-4xl font-semibold text-coffee">{category.name}</h2>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-copper">
                  {category.dishes.length} plat{category.dishes.length > 1 ? "s" : ""}
                </span>
              </div>

              {category.dishes.length === 0 ? (
                <p className="py-6 text-center text-sm text-coffee/60">Aucun plat actif dans cette catégorie.</p>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {category.dishes.map((dish) => (
                    <article
                      key={dish.id}
                      className="flex gap-4 rounded-lg border border-coffee/10 bg-white/70 p-3"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-sand/30">
                        <Image
                          src={dish.imageUrl || "/images/menu/placeholder-seafood.svg"}
                          alt={dish.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-display text-2xl font-semibold leading-none text-coffee">
                              {dish.name}
                            </h3>
                            {dish.badge ? (
                              <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-sea">
                                {dish.badge}
                              </p>
                            ) : null}
                          </div>
                          <p className="text-xs font-bold uppercase tracking-[0.1em] text-copper">
                            {displayPrice(dish.price)}
                          </p>
                        </div>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-coffee/70">{dish.description}</p>
                        {dish.allergens ? (
                          <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-olive">
                            Allergènes : {dish.allergens}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
