import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const sqlite = new Database(process.env.DATABASE_URL?.replace("file:", "") ?? "dev.db");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite);
