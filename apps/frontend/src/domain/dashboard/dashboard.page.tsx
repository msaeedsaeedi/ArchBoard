"use client";

import { useCallback, useState, useTransition } from "react";
import { getBoards } from "./actions";
import { BoardList } from "./components/board-list";
import { BoardsGridSkeleton } from "./components/boards-skeleton";
import { CreateBoardDialog } from "./components/create-board-dialog";
import SearchInput from "./components/search-input";
import type { Board } from "./types";

export default function DashboardPage() {
  const [isPending, startTransition] = useTransition();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleSearch = useCallback((term: string) => {
    startTransition(async () => {
      const boards = await getBoards(term);
      setBoards(boards);
      setIsInitialLoad(false);
    });
  }, []);

  function handleSuccess(board: Board) {
    setBoards((prevBoards) => [board, ...prevBoards]);
  }

  function handleBoardDelete(boardId: string) {
    setBoards((prevBoards) =>
      prevBoards.filter((board) => board.id !== boardId),
    );
  }

  return (
    <main className="p-4">
      <div className="flex gap-4">
        <SearchInput onSearch={handleSearch} isLoading={isPending} />
        <CreateBoardDialog onSuccess={handleSuccess} />
      </div>
      <div className="my-4">
        {isInitialLoad ? (
          <BoardsGridSkeleton />
        ) : (
          <BoardList boards={boards} onBoardDelete={handleBoardDelete} />
        )}
      </div>
    </main>
  );
}
