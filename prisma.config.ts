import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL;

const baseConfig = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.mjs"
  }
} as const;

export default defineConfig(
  databaseUrl
    ? {
        ...baseConfig,
        datasource: {
          url: databaseUrl
        }
      }
    : baseConfig
);
