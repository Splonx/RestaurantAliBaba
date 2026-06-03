import { Camera, CalendarHeart, ClipboardList, Layers3, Star, Tags, Utensils } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import type { UpdatedAtRow } from "@/lib/prisma-types";

type DashboardStats = {
  dishCount: number;
  categoryCount: number;
  galleryCount: number;
  eventCount: number;
  reservationCount: number;
  testimonialCount: number;
  latest: Date | undefined;
};

type DashboardCard = {
  label: string;
  value: number;
  icon: LucideIcon;
};

function isDate(value: Date | undefined): value is Date {
  return value instanceof Date;
}

async function getStats(): Promise<DashboardStats> {
  const latestRowsQuery: Promise<UpdatedAtRow[]> = Promise.all([
    prisma.dish.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
    prisma.category.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
    prisma.galleryImage.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
    prisma.eventService.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
    prisma.reservation.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
    prisma.testimonial.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
    prisma.seoPage.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
    prisma.brandAsset.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
    prisma.siteSetting.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } })
  ]);
  const [dishCount, categoryCount, galleryCount, eventCount, reservationCount, testimonialCount, latestRows] = await Promise.all([
    prisma.dish.count(),
    prisma.category.count(),
    prisma.galleryImage.count(),
    prisma.eventService.count(),
    prisma.reservation.count(),
    prisma.testimonial.count(),
    latestRowsQuery
  ]);

  const latest = latestRows
    .map((row: UpdatedAtRow) => row?.updatedAt)
    .filter(isDate)
    .sort((left: Date, right: Date) => Number(right) - Number(left))[0];

  return { dishCount, categoryCount, galleryCount, eventCount, reservationCount, testimonialCount, latest };
}

export default async function DashboardPage() {
  const stats = await getStats();
  const cards: DashboardCard[] = [
    { label: "Plats", value: stats.dishCount, icon: Utensils },
    { label: "Catégories", value: stats.categoryCount, icon: Tags },
    { label: "Images galerie", value: stats.galleryCount, icon: Camera },
    { label: "Événements", value: stats.eventCount, icon: CalendarHeart },
    { label: "Réservations", value: stats.reservationCount, icon: ClipboardList },
    { label: "Avis", value: stats.testimonialCount, icon: Star }
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        text="Vue rapide du contenu publié et des éléments gérés depuis le back-office."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-lg bg-cream p-6 shadow-admin">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-terracotta">
                    {card.label}
                  </p>
                  <p className="mt-3 font-display text-5xl font-semibold text-coffee">
                    {card.value}
                  </p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-olive/10 text-olive">
                  <Icon size={23} aria-hidden />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-6 rounded-lg bg-coffee p-6 text-cream shadow-admin">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-terracotta">
            <Layers3 size={22} aria-hidden />
          </div>
          <div>
            <p className="font-display text-3xl font-semibold">Dernière modification</p>
            <p className="mt-2 text-cream/70">{formatDateTime(stats.latest)}</p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-cream/60">
              Le propriétaire peut modifier les plats, catégories, galerie, événements,
              réservations, avis, SEO, branding et textes du site sans toucher au code.
              Les uploads utilisent Cloudinary si les variables CLOUDINARY_* sont configurées.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
