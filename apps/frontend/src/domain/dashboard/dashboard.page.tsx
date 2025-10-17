"use client";

import { useCallback, useState, useTransition } from "react";
import { getBoards } from "./actions";
import { BoardList } from "./components/board-list";
import { BoardsGridSkeleton } from "./components/boards-skeleton";
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

  return (
    <main className="p-4">
      <SearchInput onSearch={handleSearch} />
      <div className="my-4">
        {isPending || isInitialLoad ? (
          <BoardsGridSkeleton />
        ) : (
          <BoardList boards={boards} />
        )}
      </div>
    </main>
  );
}
