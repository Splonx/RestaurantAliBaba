import { spawnSync } from "node:child_process";

function run(command) {
  const result = spawnSync(command, {
    stdio: "inherit",
    shell: true,
    env: process.env
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const shouldRunMigrations =
  process.env.VERCEL === "1" ||
  process.env.CI === "true" ||
  process.env.RUN_PRISMA_MIGRATIONS === "true";

if (shouldRunMigrations) {
  run("npx prisma migrate deploy");
}

run("npx prisma generate");
run("next build");
