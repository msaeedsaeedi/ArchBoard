import {
  and,
  asc,
  DrizzleQueryError,
  desc,
  eq,
  isNotNull,
  like,
  lt,
  or,
} from "drizzle-orm";
import log from "encore.dev/log";
import { DatabaseError } from "pg";
import { v4 as uuid } from "uuid";
import type { AuthData } from "@/auth/auth";
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
    user: AuthData,
  ): Promise<Interface.CreateBoardResponse> => {
    try {
      const id = uuid();
      const req = { ...data, boardId: id, slug: id, owner: user.userID }; // TODO: Implement scalable slug generation
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
    user: AuthData,
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
          and(
            eq(boards.owner, user.userID),
            or(
              like(boards.name, `%${searchQuery}%`),
              like(boards.description, `%${searchQuery}%`),
            ),
          ),
        );
      } else {
        query = query.where(eq(boards.owner, user.userID));
      }

      if (sortBy === "name") {
        query = query.orderBy(orderDirection(boards.name));
      } else if (sortBy === "slug") {
        query = query.orderBy(orderDirection(boards.slug));
      } else {
        query = query.orderBy(orderDirection(boards.boardId));
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
    user: AuthData,
  ): Promise<Interface.GetBoardResponse> => {
    try {
      const [board] = await db
        .select()
        .from(boards)
        .where(
          and(
            eq(boards.owner, user.userID),
            eq(boards.boardId, params.boardId),
          ),
        )
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
    user: AuthData,
  ): Promise<Interface.UpdateBoardResponse> => {
    const { boardId: id, ...updateData } = params;

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
        .where(and(eq(boards.owner, user.userID), eq(boards.boardId, id)))
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

  softDelete: async (
    req: Interface.DeleteBoardRequest,
    user: AuthData,
  ): Promise<Interface.DeleteBoardResponse> => {
    try {
      const result = await db
        .update(boards)
        .set({ deletedAt: new Date() })
        .where(
          and(eq(boards.owner, user.userID), eq(boards.boardId, req.boardId)),
        );

      if (result.rowCount === 0) {
        throw new BoardNotFoundError();
      }

      return { success: true };
    } catch (dbError) {
      if (dbError instanceof DrizzleQueryError) {
        if (dbError.cause instanceof DatabaseError) {
          // Handle specific database errors if needed
        }
      }
      log.error(JSON.stringify(dbError));
      throw dbError;
    }
  },

  deleteOldBoards: async (): Promise<void> => {
    const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await db
      .delete(boards)
      .where(
        and(isNotNull(boards.deletedAt), lt(boards.deletedAt, THIRTY_DAYS_AGO)),
      );

    if (result.rowCount === 0) {
      log.info("No old boards found for hard deletion.");
    } else {
      log.info(`Successfully deleted ${result.rowCount} old boards.`);
    }
  },
};

export default BoardService;
