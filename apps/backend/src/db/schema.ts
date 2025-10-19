import * as p from "drizzle-orm/pg-core";
import { pgEnum, primaryKey } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["viewer", "editor"]);

export const users = p.pgTable("users", {
  id: p.text().primaryKey(),
  name: p.text().notNull(),
  image_url: p.text(),
});

export const boards = p.pgTable("boards", {
  boardId: p.uuid().primaryKey(),
  name: p.text().notNull(),
  slug: p.text().notNull().unique(),
  description: p.text(),
  owner: p
    .text()
    .notNull()
    .references(() => users.id),
});

export const boardCollaborators = p.pgTable(
  "board_collaborators",
  {
    board_id: p
      .uuid()
      .notNull()
      .references(() => boards.boardId),
    user_id: p
      .text()
      .notNull()
      .references(() => users.id),
    role: rolesEnum().notNull().default("viewer"),
  },
  (table) => [primaryKey({ columns: [table.board_id, table.user_id] })],
);
