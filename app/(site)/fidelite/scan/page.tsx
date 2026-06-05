import { BadgePercent, ScanLine } from "lucide-react";
import LoyaltyActionPanel from "@/components/admin/LoyaltyActionPanel";
import LoyaltyScanner from "@/components/admin/LoyaltyScanner";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Scan fidélité | Restaurant Ali Baba"
};

function paramValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function rewardLabel(type: string) {
  return type === "DISCOUNT_50" ? "-50%" : "-25%";
}

export default async function PublicLoyaltyScanPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const selectedToken = paramValue(params.client)?.trim();
  const customer = selectedToken
    ? await prisma.loyaltyCustomer.findUnique({
        where: { publicToken: selectedToken },
        include: {
          rewards: { orderBy: [{ cycleNumber: "desc" }, { unlockedAt: "desc" }] },
          transactions: { orderBy: { createdAt: "desc" }, take: 8, include: { reward: true } }
        }
      })
    : null;
  const availableRewards = customer?.rewards.filter((reward) => reward.status === "AVAILABLE") ?? [];

  return (
    <main className="min-h-screen bg-[#f5efe5] px-5 py-6 text-coffee sm:px-7 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Restaurant Ali Baba</p>
            <h1 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Scan fidélité
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-coffee/65">
              Scannez la carte client, vérifiez le compteur, puis validez l’action côté serveur.
            </p>
          </div>
          <a
            href="/admin/fidelite"
            className="focus-ring inline-flex items-center justify-center rounded-lg bg-coffee px-4 py-3 text-sm font-bold text-cream"
          >
            Back-office
          </a>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <LoyaltyScanner targetPath="/fidelite/scan" />

          {customer ? (
            <section className="space-y-5">
              <article className="rounded-lg bg-cream p-5 shadow-admin">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Client chargé</p>
                    <h2 className="mt-2 font-display text-4xl font-semibold text-coffee">
                      {customer.firstName} {customer.lastName ?? ""}
                    </h2>
                    <p className="mt-2 text-sm text-coffee/60">{customer.phone}</p>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-olive/10 text-olive">
                    <ScanLine size={24} aria-hidden />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <MiniStat label="Compteur" value={`${customer.stampCount}/10`} />
                  <MiniStat label="Statut" value={customer.status} />
                  <MiniStat label="Cycle" value={String(customer.cycleNumber)} />
                </div>

                <div className="mt-5 rounded-lg border border-coffee/10 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <BadgePercent className="text-terracotta" size={20} aria-hidden />
                    <p className="font-semibold text-coffee">Récompenses disponibles</p>
                  </div>
                  {availableRewards.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {availableRewards.map((reward) => (
                        <span key={reward.id} className="rounded-lg bg-olive/10 px-3 py-2 text-sm font-bold text-olive">
                          {rewardLabel(reward.type)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-coffee/55">Aucune récompense disponible.</p>
                  )}
                </div>
              </article>

              <LoyaltyActionPanel
                compact
                customerId={customer.id}
                status={customer.status}
                rewards={customer.rewards.map((reward) => ({
                  id: reward.id,
                  type: reward.type,
                  status: reward.status
                }))}
              />

              <article className="rounded-lg bg-cream p-5 shadow-admin">
                <h3 className="font-display text-3xl font-semibold text-coffee">Dernières actions</h3>
                <div className="mt-4 divide-y divide-coffee/10">
                  {customer.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <span className="font-semibold text-coffee">{transaction.type.replaceAll("_", " ")}</span>
                      <span className="text-right text-coffee/55">{formatDateTime(transaction.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          ) : (
            <section className="grid min-h-[24rem] place-items-center rounded-lg bg-cream p-8 text-center text-coffee/60 shadow-admin">
              Scannez une carte ou utilisez le champ manuel pour charger la fiche client.
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-coffee/10 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-coffee/50">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-coffee">{value}</p>
    </div>
  );
}
