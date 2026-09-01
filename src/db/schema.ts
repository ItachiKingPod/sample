import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const expenses = sqliteTable(
  "expenses",
  {
    id: text("id").primaryKey(),
    amountCents: integer("amount_cents").notNull(),
    category: text("category").notNull(),
    date: text("date").notNull(),
    note: text("note"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("expenses_date_idx").on(table.date)],
);
