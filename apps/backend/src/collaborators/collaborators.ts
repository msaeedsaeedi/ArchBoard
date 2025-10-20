import { APIError, api } from "encore.dev/api";
import log from "encore.dev/log";
import type { AuthData } from "@/auth/auth";
import { BoardNotFoundError } from "@/boards/error";
import { getAuthData } from "~encore/auth";
import type * as Interface from "./collaborators.interface";
import CollaboratorService from "./collaborators.service";
import {
  CannotRemoveOwnerError,
  CollaboratorAlreadyExistsError,
  CollaboratorNotFoundError,
  CollaboratorsNotFoundError,
  InsufficientPermissionsError,
} from "./error";

/**
 * Get All Collaborators
 */
export const read = api(
  {
    expose: true,
    method: "GET",
    path: "/boards/:boardId/collaborators",
    auth: true,
  },
  async (
    req: Interface.GetCollaboratorsRequest,
  ): Promise<Interface.GetCollaboratorsResponse> => {
    try {
      const user = getAuthData() as AuthData;
      return await CollaboratorService.find(req, user);
    } catch (error) {
      log.trace("Error trace: ", error);
      if (error instanceof BoardNotFoundError) {
        throw APIError.notFound(error.message);
      }
      if (error instanceof CollaboratorsNotFoundError) {
        throw APIError.notFound(error.message);
      }
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal("Error retrieving collaborators");
    }
  },
);

/**
 * Add Collaborator
 */
export const add = api(
  {
    expose: true,
    method: "POST",
    path: "/boards/:boardId/collaborators",
    auth: true,
  },
  async (
    req: Interface.AddCollaboratorRequest,
  ): Promise<Interface.AddCollaboratorResponse> => {
    try {
      const user = getAuthData() as AuthData;
      return await CollaboratorService.add(req, user);
    } catch (error) {
      log.trace("Error trace: ", error);
      if (error instanceof BoardNotFoundError) {
        throw APIError.notFound(error.message);
      }
      if (error instanceof CollaboratorNotFoundError) {
        throw APIError.notFound(error.message);
      }
      if (error instanceof CollaboratorAlreadyExistsError) {
        throw APIError.alreadyExists(error.message);
      }
      if (error instanceof InsufficientPermissionsError) {
        throw APIError.permissionDenied(error.message);
      }
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal("Error adding collaborator");
    }
  },
);

/**
 * Remove Collaborator
 */
export const remove = api(
  {
    expose: true,
    method: "DELETE",
    path: "/boards/:boardId/collaborators/:userId",
    auth: true,
  },
  async (
    req: Interface.RemoveCollaboratorRequest,
  ): Promise<Interface.RemoveCollaboratorResponse> => {
    try {
      const user = getAuthData() as AuthData;
      return await CollaboratorService.remove(req, user);
    } catch (error) {
      log.trace("Error trace: ", error);
      if (error instanceof BoardNotFoundError) {
        throw APIError.notFound(error.message);
      }
      if (error instanceof CollaboratorNotFoundError) {
        throw APIError.notFound(error.message);
      }
      if (error instanceof InsufficientPermissionsError) {
        throw APIError.permissionDenied(error.message);
      }
      if (error instanceof CannotRemoveOwnerError) {
        throw APIError.invalidArgument(error.message);
      }
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal("Error removing collaborator");
    }
  },
);

/**
 * Change Collaborator Role
 */
export const updateRole = api(
  {
    expose: true,
    method: "PATCH",
    path: "/boards/:boardId/collaborators/:userId/role",
    auth: true,
  },
  async (
    req: Interface.ChangeRoleRequest,
  ): Promise<Interface.ChangeRoleResponse> => {
    try {
      const user = getAuthData() as AuthData;
      return await CollaboratorService.changeRole(req, user);
    } catch (error) {
      log.trace("Error trace: ", error);
      if (error instanceof BoardNotFoundError) {
        throw APIError.notFound(error.message);
      }
      if (error instanceof CollaboratorNotFoundError) {
        throw APIError.notFound(error.message);
      }
      if (error instanceof InsufficientPermissionsError) {
        throw APIError.permissionDenied(error.message);
      }
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal("Error updating collaborator role");
    }
  },
);
