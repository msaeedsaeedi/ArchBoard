import { boardService } from "../services/board.service";
import type { Board } from "../types";
import type { DataLoader } from "../types/loader.types";

export const boardsLoader: DataLoader<Board[]> = {
  loadingKey: "boards",
  load: async () => {
    return await boardService.getBoards();
  },
};

export const createBoardLoader = (boardId: string): DataLoader<Board> => ({
  loadingKey: `board-${boardId}`,
  load: async () => {
    // This would be implemented when board service has getBoardById
    throw new Error(`Board loading for ${boardId} not implemented yet`);
  },
});
