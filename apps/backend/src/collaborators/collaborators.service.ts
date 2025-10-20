import { and, eq, or } from "drizzle-orm";
import type { AuthData } from "@/auth/auth";
import { BoardNotFoundError } from "@/boards/error";
import { db } from "@/db/database";
import { boardCollaborators, boards, users } from "@/db/schema";
import type * as Interface from "./collaborators.interface";
import {
  CannotRemoveOwnerError,
  CollaboratorAlreadyExistsError,
  CollaboratorNotFoundError,
  CollaboratorsNotFoundError,
  InsufficientPermissionsError,
} from "./error";

const CollaboratorService = {
  find: async (
    params: Interface.GetCollaboratorsRequest,
    user: AuthData,
  ): Promise<Interface.GetCollaboratorsResponse> => {
    const access = await db
      .select({ boardId: boards.boardId })
      .from(boards)
      .leftJoin(
        boardCollaborators,
        eq(boardCollaborators.board_id, boards.boardId),
      )
      .where(
        and(
          eq(boards.boardId, params.boardId),
          or(
            eq(boards.owner, user.userID),
            eq(boardCollaborators.user_id, user.userID),
          ),
        ),
      )
      .limit(1);

    if (!access.length) {
      throw new BoardNotFoundError();
    }

    const collaborators = await db
      .select({
        userId: users.id,
        fullName: users.name,
        role: boardCollaborators.role,
      })
      .from(boardCollaborators)
      .innerJoin(users, eq(users.id, boardCollaborators.user_id))
      .where(eq(boardCollaborators.board_id, params.boardId));

    if (!collaborators.length) {
      throw new CollaboratorsNotFoundError();
    }

    return {
      boardId: params.boardId,
      collaborators: collaborators.map((collaborator) => ({
        userId: collaborator.userId,
        fullName: collaborator.fullName,
        role: collaborator.role || "viewer",
      })),
    };
  },

  add: async (
    params: Interface.AddCollaboratorRequest,
    user: AuthData,
  ): Promise<Interface.AddCollaboratorResponse> => {
    // Check if user is board owner
    const board = await db
      .select({ owner: boards.owner })
      .from(boards)
      .where(eq(boards.boardId, params.boardId))
      .limit(1);

    if (!board.length) {
      throw new BoardNotFoundError();
    }

    if (board[0].owner !== user.userID) {
      throw new InsufficientPermissionsError();
    }

    // Prevent adding the board owner as a collaborator
    if (board[0].owner === params.userId) {
      throw new CollaboratorAlreadyExistsError(
        "Cannot add board owner as collaborator.",
      );
    }

    // Check if user to be added exists
    const targetUser = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.id, params.userId))
      .limit(1);

    if (!targetUser.length) {
      throw new CollaboratorNotFoundError();
    }

    // Check if user is already a collaborator
    const existingCollaborator = await db
      .select()
      .from(boardCollaborators)
      .where(
        and(
          eq(boardCollaborators.board_id, params.boardId),
          eq(boardCollaborators.user_id, params.userId),
        ),
      )
      .limit(1);

    if (existingCollaborator.length) {
      throw new CollaboratorAlreadyExistsError();
    }

    // Add collaborator
    const [collaborator] = await db
      .insert(boardCollaborators)
      .values({
        board_id: params.boardId,
        user_id: params.userId,
        role: params.role,
      })
      .returning();

    return {
      boardId: collaborator.board_id,
      collaborator: {
        userId: collaborator.user_id,
        fullName: targetUser[0].name,
        role: collaborator.role,
      },
    };
  },

  remove: async (
    params: Interface.RemoveCollaboratorRequest,
    user: AuthData,
  ): Promise<Interface.RemoveCollaboratorResponse> => {
    // Check if user is board owner
    const board = await db
      .select({ owner: boards.owner })
      .from(boards)
      .where(eq(boards.boardId, params.boardId))
      .limit(1);

    if (!board.length) {
      throw new BoardNotFoundError();
    }

    if (board[0].owner !== user.userID) {
      throw new InsufficientPermissionsError();
    }

    // Cannot remove board owner
    if (board[0].owner === params.userId) {
      throw new CannotRemoveOwnerError();
    }

    // Check if collaborator exists
    const collaborator = await db
      .select()
      .from(boardCollaborators)
      .where(
        and(
          eq(boardCollaborators.board_id, params.boardId),
          eq(boardCollaborators.user_id, params.userId),
        ),
      )
      .limit(1);

    if (!collaborator.length) {
      throw new CollaboratorNotFoundError();
    }

    // Remove collaborator
    await db
      .delete(boardCollaborators)
      .where(
        and(
          eq(boardCollaborators.board_id, params.boardId),
          eq(boardCollaborators.user_id, params.userId),
        ),
      );

    return {
      boardId: params.boardId,
      userId: params.userId,
    };
  },

  changeRole: async (
    params: Interface.ChangeRoleRequest,
    user: AuthData,
  ): Promise<Interface.ChangeRoleResponse> => {
    // Check if user is board owner
    const board = await db
      .select({ owner: boards.owner })
      .from(boards)
      .where(eq(boards.boardId, params.boardId))
      .limit(1);

    if (!board.length) {
      throw new BoardNotFoundError();
    }

    if (board[0].owner !== user.userID) {
      throw new InsufficientPermissionsError();
    }

    // Check if collaborator exists and get user details
    const collaboratorResult = await db
      .select({
        userId: users.id,
        fullName: users.name,
        currentRole: boardCollaborators.role,
      })
      .from(boardCollaborators)
      .innerJoin(users, eq(users.id, boardCollaborators.user_id))
      .where(
        and(
          eq(boardCollaborators.board_id, params.boardId),
          eq(boardCollaborators.user_id, params.userId),
        ),
      )
      .limit(1);

    if (!collaboratorResult.length) {
      throw new CollaboratorNotFoundError();
    }

    // Update role
    await db
      .update(boardCollaborators)
      .set({ role: params.role })
      .where(
        and(
          eq(boardCollaborators.board_id, params.boardId),
          eq(boardCollaborators.user_id, params.userId),
        ),
      );

    return {
      boardId: params.boardId,
      collaborator: {
        userId: params.userId,
        fullName: collaboratorResult[0].fullName,
        role: params.role,
      },
    };
  },
};

export default CollaboratorService;
