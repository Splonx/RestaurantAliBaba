import QRCode from "qrcode";
import { BadgePercent, Ban, CheckCircle2, ScanLine, Search, Ticket, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { LoyaltyCustomerStatus, LoyaltyRewardStatus, Prisma } from "@prisma/client";
import LoyaltyActionPanel from "@/components/admin/LoyaltyActionPanel";
import PageHeader from "@/components/admin/PageHeader";
import { formatDateTime } from "@/lib/format";
import { getLoyaltyStats } from "@/lib/loyalty";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

const statCards = [
  { key: "totalCustomers", label: "Clients", icon: Users },
  { key: "activeCustomers", label: "Actifs", icon: CheckCircle2 },
  { key: "blockedCustomers", label: "Bloquées", icon: Ban },
  { key: "availableRewards", label: "Récompenses", icon: BadgePercent },
  { key: "purchasesToday", label: "Achats aujourd’hui", icon: Ticket },
  { key: "rewardsUsedThisMonth", label: "Récompenses mois", icon: ScanLine }
] as const;

function paramValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function rewardLabel(type: string) {
  return type === "DISCOUNT_50" ? "-50%" : "-25%";
}

export default async function LoyaltyAdminPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = paramValue(params.q)?.trim() ?? "";
  const status = paramValue(params.status)?.trim() ?? "";
  const selectedToken = paramValue(params.client)?.trim();
  const page = Math.max(Number(paramValue(params.page) ?? "1"), 1);
  const take = 12;
  const skip = (page - 1) * take;

  const where: Prisma.LoyaltyCustomerWhereInput = {
    ...(query
      ? {
          OR: [
            { firstName: { contains: query, mode: "insensitive" as const } },
            { lastName: { contains: query, mode: "insensitive" as const } },
            { phone: { contains: query } }
          ]
        }
      : {}),
    ...(status === LoyaltyCustomerStatus.ACTIVE || status === LoyaltyCustomerStatus.BLOCKED
      ? { status }
      : {})
  };

  const [stats, customers, totalCustomers, selectedCustomer] = await Promise.all([
    getLoyaltyStats(),
    prisma.loyaltyCustomer.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take,
      include: {
        rewards: {
          where: { status: LoyaltyRewardStatus.AVAILABLE },
          orderBy: { unlockedAt: "desc" }
        },
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    }),
    prisma.loyaltyCustomer.count({ where }),
    selectedToken
      ? prisma.loyaltyCustomer.findUnique({
          where: { publicToken: selectedToken },
          include: {
            rewards: { orderBy: [{ cycleNumber: "desc" }, { unlockedAt: "desc" }] },
            transactions: {
              orderBy: { createdAt: "desc" },
              take: 30,
              include: { reward: true }
            }
          }
        })
      : null
  ]);

  const selectedCardUrl = selectedCustomer
    ? `${getSiteUrl()}/fidelite/${selectedCustomer.publicToken}`
    : "";
  const selectedQr = selectedCardUrl
    ? await QRCode.toDataURL(selectedCardUrl, {
        margin: 1,
        width: 220,
        color: { dark: "#2B1B15", light: "#FFFBF4" }
      })
    : "";
  const totalPages = Math.max(Math.ceil(totalCustomers / take), 1);

  return (
    <>
      <PageHeader
        title="Fidélité"
        text="Dashboard, recherche client, récompenses disponibles et actions tracées du programme fidélité."
        action={
          <Link
            href="/admin/fidelite/scan"
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-coffee px-5 py-3 text-sm font-bold text-cream"
          >
            <ScanLine size={18} aria-hidden />
            Scanner
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.key} className="rounded-lg bg-cream p-5 shadow-admin">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-terracotta">
                    {card.label}
                  </p>
                  <p className="mt-2 font-display text-4xl font-semibold text-coffee">
                    {stats[card.key]}
                  </p>
                </div>
                <Icon className="text-olive" size={24} aria-hidden />
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-lg bg-cream p-5 shadow-admin">
          <form className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input
              name="q"
              defaultValue={query}
              placeholder="Rechercher nom ou téléphone"
              className="focus-ring rounded-lg border border-coffee/10 bg-white px-4 py-3 text-sm outline-none"
            />
            <select
              name="status"
              defaultValue={status}
              className="focus-ring rounded-lg border border-coffee/10 bg-white px-4 py-3 text-sm font-semibold outline-none"
            >
              <option value="">Tous statuts</option>
              <option value="ACTIVE">Actives</option>
              <option value="BLOCKED">Bloquées</option>
            </select>
            <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-terracotta px-5 py-3 text-sm font-bold text-cream">
              <Search size={17} aria-hidden />
              Rechercher
            </button>
          </form>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-coffee/10 text-xs uppercase tracking-[0.14em] text-coffee/55">
                  <th className="py-3">Client</th>
                  <th className="py-3">Statut</th>
                  <th className="py-3">Compteur</th>
                  <th className="py-3">Récompense</th>
                  <th className="py-3">Dernière activité</th>
                  <th className="py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-coffee/10">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="py-3">
                      <p className="font-semibold text-coffee">
                        {customer.firstName} {customer.lastName ?? ""}
                      </p>
                      <p className="text-coffee/55">{customer.phone}</p>
                    </td>
                    <td className="py-3">{customer.status}</td>
                    <td className="py-3">{customer.stampCount}/10</td>
                    <td className="py-3">
                      {customer.rewards[0] ? rewardLabel(customer.rewards[0].type) : "Aucune"}
                    </td>
                    <td className="py-3">
                      {formatDateTime(customer.transactions[0]?.createdAt ?? customer.updatedAt)}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/fidelite?client=${customer.publicToken}`}
                        className="focus-ring rounded-lg bg-coffee px-3 py-2 text-xs font-bold text-cream"
                      >
                        Fiche
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-coffee/60">
            <span>
              Page {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <PageLink disabled={page <= 1} href={`/admin/fidelite?q=${query}&status=${status}&page=${page - 1}`}>
                Précédent
              </PageLink>
              <PageLink disabled={page >= totalPages} href={`/admin/fidelite?q=${query}&status=${status}&page=${page + 1}`}>
                Suivant
              </PageLink>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          {selectedCustomer ? (
            <>
              <article className="rounded-lg bg-cream p-5 shadow-admin">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Fiche client</p>
                    <h2 className="mt-2 font-display text-4xl font-semibold text-coffee">
                      {selectedCustomer.firstName} {selectedCustomer.lastName ?? ""}
                    </h2>
                    <p className="mt-2 text-sm text-coffee/60">{selectedCustomer.phone}</p>
                    {selectedCustomer.email ? (
                      <p className="text-sm text-coffee/60">{selectedCustomer.email}</p>
                    ) : null}
                  </div>
                  <div className="rounded-lg bg-white p-3">
                    <img src={selectedQr} alt="QR code client" className="h-36 w-36" />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <MiniStat label="Compteur" value={`${selectedCustomer.stampCount}/10`} />
                  <MiniStat label="Achats total" value={String(selectedCustomer.lifetimePurchases)} />
                  <MiniStat label="Cycle" value={String(selectedCustomer.cycleNumber)} />
                </div>
              </article>

              <LoyaltyActionPanel
                customerId={selectedCustomer.id}
                status={selectedCustomer.status}
                rewards={selectedCustomer.rewards.map((reward) => ({
                  id: reward.id,
                  type: reward.type,
                  status: reward.status
                }))}
              />

              <article className="rounded-lg bg-cream p-5 shadow-admin">
                <h3 className="font-display text-3xl font-semibold text-coffee">Historique complet</h3>
                <div className="mt-4 divide-y divide-coffee/10">
                  {selectedCustomer.transactions.map((transaction) => (
                    <div key={transaction.id} className="py-3 text-sm">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-semibold text-coffee">
                          {transaction.type.replaceAll("_", " ")}
                          {transaction.stampDelta ? ` (${transaction.stampDelta > 0 ? "+" : ""}${transaction.stampDelta})` : ""}
                        </p>
                        <p className="text-coffee/55">{formatDateTime(transaction.createdAt)}</p>
                      </div>
                      {transaction.note ? (
                        <p className="mt-1 text-coffee/60">{transaction.note}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            </>
          ) : (
            <div className="rounded-lg bg-cream p-8 text-center text-coffee/60 shadow-admin">
              Sélectionnez un client pour afficher sa fiche, son QR code et ses actions.
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-coffee/10 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-coffee/50">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-coffee">{value}</p>
    </div>
  );
}

function PageLink({
  href,
  disabled,
  children
}: {
  href: string;
  disabled: boolean;
  children: ReactNode;
}) {
  if (disabled) {
    return <span className="rounded-lg border border-coffee/10 px-3 py-2 text-coffee/35">{children}</span>;
  }

  return (
    <Link href={href} className="focus-ring rounded-lg border border-coffee/10 bg-white px-3 py-2 font-semibold text-coffee">
      {children}
    </Link>
  );
}
