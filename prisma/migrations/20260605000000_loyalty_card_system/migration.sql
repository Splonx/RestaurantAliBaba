CREATE TYPE "LoyaltyCustomerStatus" AS ENUM ('ACTIVE', 'BLOCKED');

CREATE TYPE "LoyaltyRewardType" AS ENUM ('DISCOUNT_25', 'DISCOUNT_50');

CREATE TYPE "LoyaltyRewardStatus" AS ENUM ('AVAILABLE', 'USED', 'EXPIRED', 'CANCELLED');

CREATE TYPE "LoyaltyTransactionType" AS ENUM (
  'CARD_CREATED',
  'STAMP_ADDED',
  'STAMP_REMOVED',
  'REWARD_UNLOCKED',
  'REWARD_USED',
  'RESET',
  'BLOCKED',
  'UNBLOCKED',
  'MANUAL_ADJUSTMENT'
);

CREATE TABLE "LoyaltyCustomer" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "publicToken" TEXT NOT NULL,
  "stampCount" INTEGER NOT NULL DEFAULT 0,
  "lifetimePurchases" INTEGER NOT NULL DEFAULT 0,
  "cycleNumber" INTEGER NOT NULL DEFAULT 1,
  "status" "LoyaltyCustomerStatus" NOT NULL DEFAULT 'ACTIVE',
  "walletProvider" TEXT,
  "walletPassId" TEXT,
  "walletLastSyncAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "LoyaltyReward" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "customerId" TEXT NOT NULL,
  "cycleNumber" INTEGER NOT NULL,
  "type" "LoyaltyRewardType" NOT NULL,
  "status" "LoyaltyRewardStatus" NOT NULL DEFAULT 'AVAILABLE',
  "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LoyaltyReward_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "LoyaltyCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "LoyaltyTransaction" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "customerId" TEXT NOT NULL,
  "cycleNumber" INTEGER NOT NULL,
  "type" "LoyaltyTransactionType" NOT NULL,
  "stampDelta" INTEGER,
  "rewardId" TEXT,
  "adminId" TEXT,
  "note" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LoyaltyTransaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "LoyaltyCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "LoyaltyTransaction_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "LoyaltyReward"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "LoyaltyCustomer_phone_key" ON "LoyaltyCustomer"("phone");
CREATE UNIQUE INDEX "LoyaltyCustomer_publicToken_key" ON "LoyaltyCustomer"("publicToken");
CREATE INDEX "LoyaltyCustomer_status_idx" ON "LoyaltyCustomer"("status");
CREATE INDEX "LoyaltyCustomer_createdAt_idx" ON "LoyaltyCustomer"("createdAt");
CREATE UNIQUE INDEX "LoyaltyReward_customerId_cycleNumber_type_key" ON "LoyaltyReward"("customerId", "cycleNumber", "type");
CREATE INDEX "LoyaltyReward_status_idx" ON "LoyaltyReward"("status");
CREATE INDEX "LoyaltyTransaction_customerId_createdAt_idx" ON "LoyaltyTransaction"("customerId", "createdAt");
CREATE INDEX "LoyaltyTransaction_type_idx" ON "LoyaltyTransaction"("type");
CREATE INDEX "LoyaltyTransaction_adminId_idx" ON "LoyaltyTransaction"("adminId");
