import { Suspense } from "react";
import { getCurrentUser } from "@/lib/utils/auth";
import { getBoards } from "./actions/board-actions";
import { BoardGridSkeleton } from "./components/board-grid-skeleton";
import { BoardList } from "./components/board-list";
import { DashboardHeader } from "./components/dashboard-header";

async function BoardsContent() {
  try {
    const boards = await getBoards();
    return <BoardList boards={boards} isLoading={false} />;
  } catch (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : "Failed to load boards"}
        </p>
      </div>
    );
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<BoardGridSkeleton />}>
          <BoardsContent />
        </Suspense>
      </main>
    </div>
  );
}
