import type { MinLen, StartsWith } from "encore.dev/validate";
import type { Board } from "@/boards/boards.interface";

export type Role = "viewer" | "editor";
export type BoardId = Pick<Board, "id">;
export type FullName = string & MinLen<1>;

export interface Collaborator {
  userId: string & StartsWith<"user_">;
  fullName: string & MinLen<1>;
  role: Role;
}

/**
 * Request Schemas
 */

export type GetCollaboratorsRequest = BoardId;

export interface AddCollaboratorRequest extends BoardId {
  userId: string;
  role?: Role;
}

export interface RemoveCollaboratorRequest extends BoardId {
  userId: string;
}

export interface ChangeRoleRequest extends BoardId {
  userId: string;
  role: Role;
}

/**
 * Response Schemas
 */

export interface GetCollaboratorsResponse extends BoardId {
  collaborators: Collaborator[];
}

export interface AddCollaboratorResponse extends BoardId {
  collaborator: Collaborator;
}

export interface RemoveCollaboratorResponse extends BoardId {
  userId: string;
}

export interface ChangeRoleResponse extends BoardId {
  collaborator: Collaborator;
}
