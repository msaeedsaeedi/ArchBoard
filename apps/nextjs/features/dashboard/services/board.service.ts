import { apiClient } from "@/lib/services/api-client";
import type { Board, Collaborator, CollaboratorRole } from "@/lib/types";
import type { BoardFormData } from "../validations/schemas";

export class BoardService {
  async getBoards(): Promise<Board[]> {
    try {
      return await apiClient.get<Board[]>("/board");
    } catch {
      throw new Error("Something went wrong. Please try again later");
    }
  }

  async getCollaborators(boardId: number): Promise<Collaborator[]> {
    try {
      return await apiClient.get<Collaborator[]>(
        `/board/${boardId}/collaborators`,
      );
    } catch {
      throw new Error("Something went wrong. Please try again later");
    }
  }

  async updateBoard(id: number, data: BoardFormData): Promise<void> {
    try {
      await apiClient.patch(`/board/${id}`, data);
    } catch {
      throw new Error("Something went wrong. Please try again later.");
    }
  }

  async deleteBoard(id: number): Promise<void> {
    try {
      await apiClient.delete(`/board/${id}`);
    } catch {
      throw new Error("Unable to delete Board. Please try again later.");
    }
  }

  async createBoard(data: BoardFormData): Promise<string> {
    try {
      const response = await apiClient.post<{ slug: string }>("/board", data);
      return response.slug;
    } catch (error: unknown) {
      const apiError = error as { statusCode?: number };
      if (apiError.statusCode === 409) {
        throw new Error("Board already exists");
      }
      if (apiError.statusCode === 400) {
        throw new Error("Invalid data provided");
      }
      throw new Error("Board creation failed. Please try again later");
    }
  }

  async addCollaborator(
    boardId: number,
    email: string,
    role: CollaboratorRole,
  ): Promise<void> {
    try {
      await apiClient.post(`/board/${boardId}/collaborators`, { email, role });
    } catch (error: unknown) {
      const apiError = error as { statusCode?: number };
      if (apiError.statusCode === 409) {
        throw new Error("Collaborator already exists");
      }
      if (apiError.statusCode === 404) {
        throw new Error("Collaborator not found");
      }
      if (apiError.statusCode === 401) {
        throw new Error("Board not found");
      }
      throw new Error("Failed to add collaborator. Please try again later");
    }
  }

  async removeCollaborator(boardId: number, email: string): Promise<void> {
    try {
      await apiClient.delete(`/board/${boardId}/collaborator`, { email });
    } catch {
      throw new Error("Failed to remove collaborator. Please try again later");
    }
  }
}

export const boardService = new BoardService();
