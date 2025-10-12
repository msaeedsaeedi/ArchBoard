"use client";

import { Edit, Eye, MoreHorizontal, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoardStore } from "@/lib/store/board.store";
import type { Board } from "@/lib/types";

interface BoardListProps {
  boards?: Board[];
  isLoading?: boolean;
}

export function BoardList({ boards, isLoading = false }: BoardListProps) {
  const router = useRouter();
  const { searchTerm } = useBoardStore();

  // Filter boards based on search term
  const filteredBoards = boards
    ? boards.filter((board) => {
        if (!searchTerm) return true;
        return (
          board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          board.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  const handleBoardClick = (board: Board) => {
    router.push(`/board/${board.slug}`);
  };

  const handleEditBoard = (board: Board) => {
    // TODO: Implement edit functionality
    console.log("Edit board:", board);
  };

  const handleDeleteBoard = (board: Board) => {
    // TODO: Implement delete functionality
    console.log("Delete board:", board);
  };

  const handleViewCollaborators = (board: Board) => {
    // TODO: Implement collaborators functionality
    console.log("View collaborators:", board);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={`skeleton-${i + 1}`} className="h-48">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-6 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredBoards.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No boards found
        </h3>
        <p className="text-muted-foreground">
          {useBoardStore.getState().searchTerm
            ? "Try adjusting your search terms"
            : "Create your first board to get started"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBoards.map((board) => (
          <Card
            key={board.id}
            className="hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <button
                  type="button"
                  className="flex-1 min-w-0 text-left"
                  onClick={() => handleBoardClick(board)}
                >
                  <CardTitle className="text-lg truncate">
                    {board.title}
                  </CardTitle>
                  {board.description && (
                    <CardDescription className="mt-1 line-clamp-2">
                      {board.description}
                    </CardDescription>
                  )}
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditBoard(board)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleViewCollaborators(board)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Collaborators
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteBoard(board)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent
              className="pt-0"
              onClick={() => handleBoardClick(board)}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>Click to view</span>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              {board.collaborated && (
                <Badge variant="secondary" className="text-xs">
                  Shared
                </Badge>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* TODO: Add dialogs for edit, delete, and collaborators */}
    </>
  );
}
