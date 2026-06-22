import { BadgePercent, ScanLine, XCircle } from "lucide-react";
import Link from "next/link";
import LoyaltyActionPanel from "@/components/admin/LoyaltyActionPanel";
import LoyaltyScanner from "@/components/admin/LoyaltyScanner";
import PageHeader from "@/components/admin/PageHeader";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

function paramValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function rewardLabel(type: string) {
  return type === "DISCOUNT_50" ? "-50%" : "-25%";
}

export default async function LoyaltyScanPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
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
    <>
      <PageHeader
        title="Scanner fidélité"
        text="Scannez le QR code depuis un téléphone staff, vérifiez la fiche, puis confirmez l’action côté serveur."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <LoyaltyScanner />

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

            <Link
              href="/admin/fidelite/scan"
              className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg border border-coffee/15 bg-white px-4 py-3 text-sm font-bold text-coffee"
            >
              <XCircle size={17} aria-hidden />
              Refuser / annuler
            </Link>

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
    </>
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
