import { Camera, CalendarHeart, Layers3, Tags, Utensils } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [dishCount, categoryCount, galleryCount, eventCount, latestRows] = await Promise.all([
    prisma.dish.count(),
    prisma.category.count(),
    prisma.galleryImage.count(),
    prisma.eventService.count(),
    Promise.all([
      prisma.dish.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.category.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.galleryImage.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.eventService.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
      prisma.siteSetting.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } })
    ])
  ]);

  const latest = latestRows
    .map((row) => row?.updatedAt)
    .filter(Boolean)
    .sort((a, b) => Number(b) - Number(a))[0];

  return { dishCount, categoryCount, galleryCount, eventCount, latest };
}

export default async function DashboardPage() {
  const stats = await getStats();
  const cards = [
    { label: "Plats", value: stats.dishCount, icon: Utensils },
    { label: "Catégories", value: stats.categoryCount, icon: Tags },
    { label: "Images galerie", value: stats.galleryCount, icon: Camera },
    { label: "Événements", value: stats.eventCount, icon: CalendarHeart }
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        text="Vue rapide du contenu publié et des éléments gérés depuis le back-office."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
              Le propriétaire peut modifier les plats, catégories, galerie, événements et textes
              du site sans toucher au code. Les images uploadées sont stockées localement dans
              `public/uploads` en développement.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
