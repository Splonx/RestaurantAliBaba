import Database from "better-sqlite3";
import { mkdir, readFile } from "fs/promises";
import path from "path";

const root = process.cwd();
const dbPath = path.join(root, "prisma", "dev.db");
const migrationPath = path.join(
  root,
  "prisma",
  "migrations",
  "20260529000000_init",
  "migration.sql"
);

await mkdir(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

const existing = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'Category'")
  .get();

if (!existing) {
  const sql = await readFile(migrationPath, "utf8");
  db.exec(sql);
}

db.close();
