import { asc, DrizzleQueryError, desc, eq, like, or } from "drizzle-orm";
import log from "encore.dev/log";
import { DatabaseError } from "pg";
import { v4 as uuid } from "uuid";
import { db } from "@/db/database";
import { boards } from "@/db/schema";
import type * as Interface from "./boards.interface";
import {
  BoardNotFoundError,
  DuplicateSlugError,
  InvalidOwnerError,
  NoValidFieldsError,
} from "./error";

const BoardService = {
  create: async (
    data: Interface.CreateBoardRequest,
  ): Promise<Interface.CreateBoardResponse> => {
    try {
      const req = { ...data, id: uuid(), slug: "my-slug" };
      const [board] = await db.insert(boards).values(req).returning();
      return { board };
    } catch (dbError: unknown) {
      if (dbError instanceof DrizzleQueryError) {
        if (dbError.cause instanceof DatabaseError) {
          if (dbError.cause.code === "23505") {
            throw new DuplicateSlugError();
          }
          if (dbError.cause.code === "23503") {
            throw new InvalidOwnerError();
          }
        }
      }
      log.error(JSON.stringify(dbError));
      throw dbError;
    }
  },

  find: async (
    params: Interface.GetAllBoardsRequest,
  ): Promise<Interface.GetAllBoardsResponse> => {
    try {
      const {
        limit,
        page,
        searchTerm: searchQuery,
        sortBy,
        sortOrder,
      } = params;

      const pageNumber = page || 1;
      const pageSize = limit || 10;
      const orderDirection = sortOrder === "desc" ? desc : asc;

      let query = db.select().from(boards).$dynamic();

      if (searchQuery) {
        query = query.where(
          or(
            like(boards.name, `%${searchQuery}%`),
            like(boards.description, `%${searchQuery}%`),
          ),
        );
      }

      if (sortBy === "name") {
        query = query.orderBy(orderDirection(boards.name));
      } else if (sortBy === "slug") {
        query = query.orderBy(orderDirection(boards.slug));
      } else {
        query = query.orderBy(orderDirection(boards.id));
      }

      const result = await query
        .limit(pageSize)
        .offset((pageNumber - 1) * pageSize);

      return {
        boards: result,
        pagination: {
          page: pageNumber,
          limit: pageSize,
        },
      };
    } catch (dbError: unknown) {
      if (dbError instanceof DrizzleQueryError) {
        if (dbError.cause instanceof DatabaseError) {
          // Handle specific database errors if needed
        }
      }
      log.error(JSON.stringify(dbError));
      throw dbError;
    }
  },

  findById: async (
    params: Interface.GetBoardRequest,
  ): Promise<Interface.GetBoardResponse> => {
    try {
      const [board] = await db
        .select()
        .from(boards)
        .where(eq(boards.id, params.id))
        .limit(1);

      if (!board) {
        throw new BoardNotFoundError();
      }

      return { board };
    } catch (dbError: unknown) {
      if (dbError instanceof DrizzleQueryError) {
        if (dbError.cause instanceof DatabaseError) {
          // Handle specific database errors if needed
        }
      }
      log.error(JSON.stringify(dbError));
      throw dbError;
    }
  },

  update: async (
    params: Interface.UpdateBoardRequest,
  ): Promise<Interface.UpdateBoardResponse> => {
    const { id, ...updateData } = params;

    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined),
    );

    if (Object.keys(filteredData).length === 0) {
      throw new NoValidFieldsError();
    }

    try {
      const [updatedBoard] = await db
        .update(boards)
        .set(filteredData)
        .where(eq(boards.id, id))
        .returning();

      if (!updatedBoard) {
        throw new BoardNotFoundError();
      }

      return { board: updatedBoard };
    } catch (dbError: unknown) {
      if (dbError instanceof DrizzleQueryError) {
        if (dbError.cause instanceof DatabaseError) {
          if (dbError.cause.code === "23505") {
            throw new DuplicateSlugError();
          }
          if (dbError.cause.code === "23503") {
            throw new InvalidOwnerError();
          }
        }
      }
      log.error(JSON.stringify(dbError));
      throw dbError;
    }
  },

  delete: async (
    params: Interface.DeleteBoardRequest,
  ): Promise<Interface.DeleteBoardResponse> => {
    try {
      const [deletedBoard] = await db
        .delete(boards)
        .where(eq(boards.id, params.id))
        .returning();

      if (!deletedBoard) {
        throw new BoardNotFoundError();
      }

      return { success: true };
    } catch (dbError: unknown) {
      if (dbError instanceof DrizzleQueryError) {
        if (dbError.cause instanceof DatabaseError) {
          // Handle specific database errors if needed
        }
      }
      log.error(JSON.stringify(dbError));
      throw dbError;
    }
  },
};

export default BoardService;
