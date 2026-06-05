import { spawnSync } from "node:child_process";

const maxAttempts = 4;
const retryDelayMs = 15000;

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  console.log(`Running prisma migrate deploy (${attempt}/${maxAttempts})...`);

  const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
    encoding: "utf8",
    shell: process.platform === "win32"
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status === 0) process.exit(0);

  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  const retryable =
    output.includes("P1002") ||
    output.includes("pg_advisory_lock") ||
    output.toLowerCase().includes("advisory lock");

  if (!retryable || attempt === maxAttempts) {
    process.exit(result.status ?? 1);
  }

  console.log(`Prisma advisory lock still busy. Retrying in ${retryDelayMs / 1000}s...`);
  sleep(retryDelayMs);
}
