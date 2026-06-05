import crypto from "crypto";
import {
  LoyaltyCustomerStatus,
  LoyaltyRewardStatus,
  LoyaltyRewardType,
  LoyaltyTransactionType,
  Prisma
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

type LoyaltyTx = Prisma.TransactionClient;

const loyaltyCardInclude = Prisma.validator<Prisma.LoyaltyCustomerInclude>()({
  rewards: {
    orderBy: [{ cycleNumber: "desc" }, { unlockedAt: "desc" }]
  },
  transactions: {
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { reward: true }
  }
});

export type LoyaltyActionMeta = {
  adminId?: string;
  note?: string;
  ipAddress?: string;
  userAgent?: string;
};

export type CreateLoyaltyCardInput = {
  firstName: string;
  lastName?: string | null;
  phone: string;
  email?: string | null;
  consentAccepted: boolean;
  ipAddress?: string;
  userAgent?: string;
};

export type LoyaltyLookup = {
  publicToken?: string;
  phone?: string;
};

function normalizeOptional(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "").trim();
}

function generatePublicToken() {
  return crypto.randomBytes(24).toString("base64url");
}

function getCooldownMinutes() {
  const value = Number(process.env.LOYALTY_SCAN_COOLDOWN_MINUTES ?? "10");
  return Number.isFinite(value) && value > 0 ? value : 10;
}

function requireNote(meta: LoyaltyActionMeta, action: string) {
  if (!meta.note?.trim()) {
    throw new Error(`Une note est obligatoire pour ${action}.`);
  }
}

function transactionData(
  type: LoyaltyTransactionType,
  customerId: string,
  cycleNumber: number,
  meta: LoyaltyActionMeta,
  stampDelta?: number | null,
  rewardId?: string | null
) {
  return {
    customerId,
    cycleNumber,
    type,
    stampDelta,
    rewardId,
    adminId: normalizeOptional(meta.adminId),
    note: normalizeOptional(meta.note),
    ipAddress: normalizeOptional(meta.ipAddress),
    userAgent: normalizeOptional(meta.userAgent)
  };
}

async function createUniqueCustomerToken(tx: LoyaltyTx) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const publicToken = generatePublicToken();
    const existing = await tx.loyaltyCustomer.findUnique({ where: { publicToken } });
    if (!existing) return publicToken;
  }

  throw new Error("Impossible de générer un token fidélité unique.");
}

async function unlockRewardInTransaction(
  tx: LoyaltyTx,
  customer: { id: string; stampCount: number; cycleNumber: number },
  meta: LoyaltyActionMeta
) {
  const thresholds: Array<{ stampCount: number; type: LoyaltyRewardType }> = [
    { stampCount: 5, type: LoyaltyRewardType.DISCOUNT_25 },
    { stampCount: 10, type: LoyaltyRewardType.DISCOUNT_50 }
  ];

  for (const threshold of thresholds) {
    if (customer.stampCount < threshold.stampCount) continue;

    const existing = await tx.loyaltyReward.findUnique({
      where: {
        customerId_cycleNumber_type: {
          customerId: customer.id,
          cycleNumber: customer.cycleNumber,
          type: threshold.type
        }
      }
    });

    if (existing) continue;

    const reward = await tx.loyaltyReward.create({
      data: {
        customerId: customer.id,
        cycleNumber: customer.cycleNumber,
        type: threshold.type,
        status: LoyaltyRewardStatus.AVAILABLE
      }
    });

    await tx.loyaltyTransaction.create({
      data: transactionData(
        LoyaltyTransactionType.REWARD_UNLOCKED,
        customer.id,
        customer.cycleNumber,
        meta,
        null,
        reward.id
      )
    });
  }
}

export async function createLoyaltyCard(input: CreateLoyaltyCardInput) {
  if (!input.consentAccepted) {
    throw new Error("Le consentement aux conditions fidélité est obligatoire.");
  }

  const firstName = input.firstName.trim();
  const phone = normalizePhone(input.phone);
  if (firstName.length < 2) throw new Error("Prénom obligatoire.");
  if (phone.length < 6) throw new Error("Téléphone obligatoire.");

  return prisma.$transaction(async (tx) => {
    const existing = await tx.loyaltyCustomer.findUnique({ where: { phone } });
    if (existing) return { customer: existing, created: false };

    const customer = await tx.loyaltyCustomer.create({
      data: {
        firstName,
        lastName: normalizeOptional(input.lastName),
        phone,
        email: normalizeOptional(input.email),
        publicToken: await createUniqueCustomerToken(tx)
      }
    });

    await tx.loyaltyTransaction.create({
      data: transactionData(
        LoyaltyTransactionType.CARD_CREATED,
        customer.id,
        customer.cycleNumber,
        {
          note: "Création de carte depuis le formulaire public.",
          ipAddress: input.ipAddress,
          userAgent: input.userAgent
        }
      )
    });

    return { customer, created: true };
  });
}

export async function getCardByPublicToken(publicToken: string) {
  return prisma.loyaltyCustomer.findUnique({
    where: { publicToken },
    include: loyaltyCardInclude
  });
}

export async function findCard(lookup: LoyaltyLookup) {
  if (lookup.publicToken?.trim()) {
    return getCardByPublicToken(lookup.publicToken.trim());
  }

  if (lookup.phone?.trim()) {
    return prisma.loyaltyCustomer.findUnique({
      where: { phone: normalizePhone(lookup.phone) },
      include: loyaltyCardInclude
    });
  }

  return null;
}

export async function addStamp(customerId: string, meta: LoyaltyActionMeta) {
  requireNote(meta, "valider un achat");

  return prisma.$transaction(async (tx) => {
    const customer = await tx.loyaltyCustomer.findUnique({ where: { id: customerId } });
    if (!customer) throw new Error("Carte fidélité introuvable.");
    if (customer.status === LoyaltyCustomerStatus.BLOCKED) {
      throw new Error("Cette carte est bloquée.");
    }

    const cooldownMs = getCooldownMinutes() * 60 * 1000;
    const latestStamp = await tx.loyaltyTransaction.findFirst({
      where: {
        customerId,
        type: LoyaltyTransactionType.STAMP_ADDED,
        createdAt: { gte: new Date(Date.now() - cooldownMs) }
      },
      orderBy: { createdAt: "desc" }
    });

    if (latestStamp) {
      throw new Error(`Validation refusée : délai anti double scan de ${getCooldownMinutes()} minutes.`);
    }

    const updated = await tx.loyaltyCustomer.update({
      where: { id: customerId },
      data: {
        stampCount: { increment: 1 },
        lifetimePurchases: { increment: 1 }
      }
    });

    await tx.loyaltyTransaction.create({
      data: transactionData(
        LoyaltyTransactionType.STAMP_ADDED,
        updated.id,
        updated.cycleNumber,
        meta,
        1
      )
    });

    await unlockRewardInTransaction(tx, updated, meta);
    return tx.loyaltyCustomer.findUnique({
      where: { publicToken: updated.publicToken },
      include: loyaltyCardInclude
    });
  });
}

export async function removeStamp(customerId: string, meta: LoyaltyActionMeta) {
  requireNote(meta, "retirer un tampon");

  return prisma.$transaction(async (tx) => {
    const customer = await tx.loyaltyCustomer.findUnique({ where: { id: customerId } });
    if (!customer) throw new Error("Carte fidélité introuvable.");
    if (customer.stampCount <= 0) throw new Error("Le compteur est déjà à 0.");

    const updated = await tx.loyaltyCustomer.update({
      where: { id: customerId },
      data: { stampCount: { decrement: 1 } }
    });

    await tx.loyaltyTransaction.create({
      data: transactionData(
        LoyaltyTransactionType.STAMP_REMOVED,
        updated.id,
        updated.cycleNumber,
        meta,
        -1
      )
    });

    return tx.loyaltyCustomer.findUnique({
      where: { publicToken: updated.publicToken },
      include: loyaltyCardInclude
    });
  });
}

export async function unlockRewardIfNeeded(customerId: string, meta: LoyaltyActionMeta = {}) {
  return prisma.$transaction(async (tx) => {
    const customer = await tx.loyaltyCustomer.findUnique({ where: { id: customerId } });
    if (!customer) throw new Error("Carte fidélité introuvable.");
    await unlockRewardInTransaction(tx, customer, meta);
    return tx.loyaltyCustomer.findUnique({
      where: { publicToken: customer.publicToken },
      include: loyaltyCardInclude
    });
  });
}

export async function resetCycle(customerId: string, meta: LoyaltyActionMeta) {
  requireNote(meta, "réinitialiser le cycle");

  return prisma.$transaction(async (tx) => {
    const customer = await tx.loyaltyCustomer.findUnique({ where: { id: customerId } });
    if (!customer) throw new Error("Carte fidélité introuvable.");

    const updated = await tx.loyaltyCustomer.update({
      where: { id: customerId },
      data: {
        stampCount: 0,
        cycleNumber: { increment: 1 }
      }
    });

    await tx.loyaltyTransaction.create({
      data: transactionData(
        LoyaltyTransactionType.RESET,
        customer.id,
        customer.cycleNumber,
        meta,
        -customer.stampCount
      )
    });

    return tx.loyaltyCustomer.findUnique({
      where: { publicToken: updated.publicToken },
      include: loyaltyCardInclude
    });
  });
}

export async function useReward(
  customerId: string,
  type: LoyaltyRewardType,
  meta: LoyaltyActionMeta
) {
  requireNote(meta, "utiliser une récompense");

  return prisma.$transaction(async (tx) => {
    const customer = await tx.loyaltyCustomer.findUnique({ where: { id: customerId } });
    if (!customer) throw new Error("Carte fidélité introuvable.");
    if (customer.status === LoyaltyCustomerStatus.BLOCKED) {
      throw new Error("Cette carte est bloquée.");
    }

    const reward = await tx.loyaltyReward.findFirst({
      where: {
        customerId,
        cycleNumber: customer.cycleNumber,
        type,
        status: LoyaltyRewardStatus.AVAILABLE
      }
    });

    if (!reward) throw new Error("Récompense disponible introuvable.");

    const usedReward = await tx.loyaltyReward.update({
      where: { id: reward.id },
      data: {
        status: LoyaltyRewardStatus.USED,
        usedAt: new Date()
      }
    });

    await tx.loyaltyTransaction.create({
      data: transactionData(
        LoyaltyTransactionType.REWARD_USED,
        customer.id,
        customer.cycleNumber,
        meta,
        null,
        usedReward.id
      )
    });

    if (type === LoyaltyRewardType.DISCOUNT_50) {
      const updated = await tx.loyaltyCustomer.update({
        where: { id: customerId },
        data: {
          stampCount: 0,
          cycleNumber: { increment: 1 }
        }
      });

      await tx.loyaltyTransaction.create({
        data: transactionData(
          LoyaltyTransactionType.RESET,
          customer.id,
          customer.cycleNumber,
          meta,
          -customer.stampCount
        )
      });

      return tx.loyaltyCustomer.findUnique({
        where: { publicToken: updated.publicToken },
        include: loyaltyCardInclude
      });
    }

    return tx.loyaltyCustomer.findUnique({
      where: { publicToken: customer.publicToken },
      include: loyaltyCardInclude
    });
  });
}

export async function blockCard(customerId: string, meta: LoyaltyActionMeta) {
  requireNote(meta, "bloquer une carte");

  return prisma.$transaction(async (tx) => {
    const customer = await tx.loyaltyCustomer.update({
      where: { id: customerId },
      data: { status: LoyaltyCustomerStatus.BLOCKED }
    });

    await tx.loyaltyTransaction.create({
      data: transactionData(
        LoyaltyTransactionType.BLOCKED,
        customer.id,
        customer.cycleNumber,
        meta
      )
    });

    return tx.loyaltyCustomer.findUnique({
      where: { publicToken: customer.publicToken },
      include: loyaltyCardInclude
    });
  });
}

export async function unblockCard(customerId: string, meta: LoyaltyActionMeta) {
  requireNote(meta, "débloquer une carte");

  return prisma.$transaction(async (tx) => {
    const customer = await tx.loyaltyCustomer.update({
      where: { id: customerId },
      data: { status: LoyaltyCustomerStatus.ACTIVE }
    });

    await tx.loyaltyTransaction.create({
      data: transactionData(
        LoyaltyTransactionType.UNBLOCKED,
        customer.id,
        customer.cycleNumber,
        meta
      )
    });

    return tx.loyaltyCustomer.findUnique({
      where: { publicToken: customer.publicToken },
      include: loyaltyCardInclude
    });
  });
}

export async function getLoyaltyStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

  const [
    totalCustomers,
    activeCustomers,
    blockedCustomers,
    availableRewards,
    purchasesToday,
    rewardsUsedThisMonth
  ] = await Promise.all([
    prisma.loyaltyCustomer.count(),
    prisma.loyaltyCustomer.count({ where: { status: LoyaltyCustomerStatus.ACTIVE } }),
    prisma.loyaltyCustomer.count({ where: { status: LoyaltyCustomerStatus.BLOCKED } }),
    prisma.loyaltyReward.count({ where: { status: LoyaltyRewardStatus.AVAILABLE } }),
    prisma.loyaltyTransaction.count({
      where: {
        type: LoyaltyTransactionType.STAMP_ADDED,
        createdAt: { gte: startOfToday }
      }
    }),
    prisma.loyaltyTransaction.count({
      where: {
        type: LoyaltyTransactionType.REWARD_USED,
        createdAt: { gte: startOfMonth }
      }
    })
  ]);

  return {
    totalCustomers,
    activeCustomers,
    blockedCustomers,
    availableRewards,
    purchasesToday,
    rewardsUsedThisMonth
  };
}
