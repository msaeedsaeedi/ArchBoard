import { create } from "zustand";
import { boardService } from "../services/board.service";
import type { Board, Collaborator, CollaboratorRole } from "../types";
import type { BoardFormData } from "../validations/schemas";

interface BoardState {
  boards: Board[];
  isLoading: boolean;
  searchTerm: string;
  selectedBoard: Board | null;
  collaborators: Collaborator[];
  isCollaboratorsLoading: boolean;
}

interface BoardActions {
  fetchBoards: () => Promise<void>;
  createBoard: (data: BoardFormData) => Promise<string>;
  updateBoard: (id: number, data: BoardFormData) => Promise<void>;
  deleteBoard: (id: number) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSelectedBoard: (board: Board | null) => void;
  fetchCollaborators: (boardId: number) => Promise<void>;
  addCollaborator: (
    boardId: number,
    email: string,
    role: CollaboratorRole,
  ) => Promise<void>;
  removeCollaborator: (boardId: number, email: string) => Promise<void>;
  getFilteredBoards: () => Board[];
  setLoading: (isLoading: boolean) => void;
}

type BoardStore = BoardState & BoardActions;

export const useBoardStore = create<BoardStore>((set, get) => ({
  // Initial state
  boards: [],
  isLoading: false,
  searchTerm: "",
  selectedBoard: null,
  collaborators: [],
  isCollaboratorsLoading: false,

  // Actions
  fetchBoards: async () => {
    set({ isLoading: true });
    try {
      const boards = await boardService.getBoards();
      set({ boards, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createBoard: async (data: BoardFormData) => {
    const slug = await boardService.createBoard(data);
    // Refresh boards list
    await get().fetchBoards();
    return slug;
  },

  updateBoard: async (id: number, data: BoardFormData) => {
    await boardService.updateBoard(id, data);
    // Update the board in local state
    const boards = get().boards.map((board) =>
      board.id === id ? { ...board, ...data } : board,
    );
    set({ boards });
  },

  deleteBoard: async (id: number) => {
    await boardService.deleteBoard(id);
    // Remove board from local state
    const boards = get().boards.filter((board) => board.id !== id);
    set({ boards });
  },

  setSearchTerm: (searchTerm: string) => {
    set({ searchTerm });
  },

  setSelectedBoard: (selectedBoard: Board | null) => {
    set({ selectedBoard });
  },

  fetchCollaborators: async (boardId: number) => {
    set({ isCollaboratorsLoading: true });
    try {
      const collaborators = await boardService.getCollaborators(boardId);
      set({ collaborators, isCollaboratorsLoading: false });
    } catch (error) {
      set({ isCollaboratorsLoading: false });
      throw error;
    }
  },

  addCollaborator: async (
    boardId: number,
    email: string,
    role: CollaboratorRole,
  ) => {
    await boardService.addCollaborator(boardId, email, role);
    // Refresh collaborators list
    await get().fetchCollaborators(boardId);
  },

  removeCollaborator: async (boardId: number, email: string) => {
    await boardService.removeCollaborator(boardId, email);
    // Remove collaborator from local state
    const collaborators = get().collaborators.filter(
      (collab) => collab.email !== email,
    );
    set({ collaborators });
  },

  getFilteredBoards: () => {
    const { boards, searchTerm } = get();
    if (!searchTerm) return boards;

    return boards.filter(
      (board) =>
        board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        board.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));
