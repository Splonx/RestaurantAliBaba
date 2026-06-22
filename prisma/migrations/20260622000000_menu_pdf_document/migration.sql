CREATE TABLE "MenuDocument" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX "MenuDocument_isActive_idx" ON "MenuDocument"("isActive");
CREATE INDEX "MenuDocument_uploadedAt_idx" ON "MenuDocument"("uploadedAt");
