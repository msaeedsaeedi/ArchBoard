import { APIError, api } from "encore.dev/api";
import type { AuthData } from "@/auth/auth";
import { getAuthData } from "~encore/auth";
import type * as Interface from "./boards.interface";
import BoardService from "./boards.service";
import {
  BoardNotFoundError,
  DuplicateSlugError,
  InvalidOwnerError,
  NoValidFieldsError,
} from "./error";

/**
 * Get All Boards
 */
export const read = api(
  { expose: true, method: "GET", path: "/boards", auth: true },
  async (
    req: Interface.GetAllBoardsRequest,
  ): Promise<Interface.GetAllBoardsResponse> => {
    try {
      const user = getAuthData() as AuthData;
      return await BoardService.find(req, user);
    } catch {
      throw APIError.internal("Error retrieving boards");
    }
  },
);

/**
 * Get Single Board
 */
export const readOne = api(
  { expose: true, method: "GET", path: "/boards/:id", auth: true },
  async (
    req: Interface.GetBoardRequest,
  ): Promise<Interface.GetBoardResponse> => {
    try {
      const user = getAuthData() as AuthData;
      return await BoardService.findById(req, user);
    } catch (error) {
      if (error instanceof BoardNotFoundError) {
        throw APIError.notFound(error.message);
      }
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal("Error retrieving board");
    }
  },
);

/**
 * Create New Board
 */
export const create = api(
  { expose: true, method: "POST", path: "/boards", auth: true },
  async (
    req: Interface.CreateBoardRequest,
  ): Promise<Interface.CreateBoardResponse> => {
    try {
      const user = getAuthData() as AuthData;
      return await BoardService.create(req, user);
    } catch (error) {
      if (error instanceof DuplicateSlugError) {
        throw APIError.alreadyExists(error.message);
      }
      if (error instanceof InvalidOwnerError) {
        throw APIError.invalidArgument(error.message);
      }
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal("Error creating board");
    }
  },
);

/**
 * Update Board
 */
export const update = api(
  { expose: true, method: "PATCH", path: "/boards/:id", auth: true },
  async (
    req: Interface.UpdateBoardRequest,
  ): Promise<Interface.UpdateBoardResponse> => {
    try {
      const user = getAuthData() as AuthData;
      return await BoardService.update(req, user);
    } catch (error) {
      if (error instanceof BoardNotFoundError) {
        throw APIError.notFound(error.message);
      }
      if (error instanceof NoValidFieldsError) {
        throw APIError.invalidArgument(error.message);
      }
      if (error instanceof DuplicateSlugError) {
        throw APIError.alreadyExists(error.message);
      }
      if (error instanceof InvalidOwnerError) {
        throw APIError.invalidArgument(error.message);
      }
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal("Error updating board");
    }
  },
);

/**
 * Delete Board
 */
export const remove = api(
  {
    expose: true,
    method: "DELETE",
    path: "/boards/:id",
    auth: true,
  },
  async (
    req: Interface.DeleteBoardRequest,
  ): Promise<Interface.DeleteBoardResponse> => {
    try {
      const user = getAuthData() as AuthData;
      return await BoardService.delete(req, user);
    } catch (error) {
      if (error instanceof BoardNotFoundError) {
        throw APIError.notFound(error.message);
      }
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal("Error deleting board");
    }
  },
);
