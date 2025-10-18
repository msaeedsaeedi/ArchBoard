import { APIError, api } from "encore.dev/api";
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
      return await BoardService.find(req);
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
      return await BoardService.findById(req);
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
      return await BoardService.create(req);
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
      return await BoardService.update(req);
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
      return await BoardService.delete(req);
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
