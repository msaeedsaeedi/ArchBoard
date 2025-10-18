import type { MaxLen, Min, MinLen } from "encore.dev/validate";

export interface Board {
  id: string & (MinLen<36> & MaxLen<36>);
  name: string & MinLen<1>;
  slug: string & MinLen<1>;
  description: (string & MinLen<1>) | null;
  owner: string & MinLen<1>;
}

/**
 * Request Schemas
 */

export interface GetAllBoardsRequest {
  page?: number & Min<0>;
  limit?: number & Min<0>;
  searchTerm?: string & MinLen<1>;
  sortBy?: "slug" | "name";
  sortOrder?: "asc" | "desc";
}

export type GetBoardRequest = Pick<Board, "id">;
export type CreateBoardRequest = Omit<Board, "id" | "slug" | "owner">;
export type UpdateBoardRequest = {
  [K in keyof Board]: K extends "id" ? Board[K] : Board[K] | undefined;
};
export type DeleteBoardRequest = Pick<Board, "id">;

/**
 * Response Schemas
 */

export interface GetAllBoardsResponse {
  boards: Board[];
  pagination?: {
    page: number;
    limit: number;
    total?: number;
  };
}

export interface GetBoardResponse {
  board: Board;
}

export interface CreateBoardResponse {
  board: Board;
}

export interface UpdateBoardResponse {
  board: Board;
}

export interface DeleteBoardResponse {
  success: true;
  message?: string;
}
