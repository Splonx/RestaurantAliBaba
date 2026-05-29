import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function readDatabaseUrlFromDotEnv() {
  const envPath = join(process.cwd(), ".env");
  if (!existsSync(envPath)) return null;

  const content = readFileSync(envPath, "utf8");
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    if (!trimmed.startsWith("DATABASE_URL=")) continue;
    const [, rawValue = ""] = trimmed.split("=", 2);
    const value = rawValue.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");
    return value || null;
  }
  return null;
}

const databaseUrl = process.env.DATABASE_URL ?? readDatabaseUrlFromDotEnv();

if (!databaseUrl) {
  console.error(
    "Build aborted: DATABASE_URL is missing. Add a valid PostgreSQL URL in your environment variables."
  );
  process.exit(1);
}

if (!/^postgres(ql)?:\/\//i.test(databaseUrl)) {
  console.error(
    "Build aborted: DATABASE_URL must start with postgresql:// or postgres://."
  );
  process.exit(1);
}

if (process.env.VERCEL === "1") {
  const isLocalHost = /@(?:127\.0\.0\.1|localhost)(?::\d+)?\//i.test(databaseUrl);
  if (isLocalHost) {
    console.error(
      "Build aborted: DATABASE_URL points to localhost on Vercel. Configure a managed PostgreSQL URL (Neon/Supabase) in Vercel environment variables."
    );
    process.exit(1);
  }
}
