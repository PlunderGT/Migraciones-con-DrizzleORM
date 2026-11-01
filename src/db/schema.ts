import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  author: varchar("author", { length: 120 }).notNull(),
  // Evolución (migración 0001)
  isbn: varchar("isbn", { length: 20 }).unique(),
  year: integer("year"),
  genre: varchar("genre", { length: 60 }).default("General").notNull(),
  available: boolean("available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
