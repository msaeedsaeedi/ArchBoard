"use client";

import { Edit, MoreVertical, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Board } from "../types";
import { DeleteBoardDialog } from "./delete-board-dialog";

interface BoardCardProps {
  board: Board;
  onDelete?: (boardId: string) => void;
}

export default function BoardCard({ board, onDelete }: BoardCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const maxCollaboratorsToShow = 3;
  const collaboratorsToShow =
    board.collaborators?.slice(0, maxCollaboratorsToShow) || [];
  const remainingCount =
    (board.collaborators?.length || 0) - maxCollaboratorsToShow;

  function onEdit(_board: Board) {}
  function onManageCollaborators(_board: Board) {}

  function handleDeleteClick() {
    setShowDeleteDialog(true);
  }

  function handleDeleteSuccess(boardId: string) {
    setShowDeleteDialog(false);
    onDelete?.(boardId);
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onEdit(board)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageCollaborators(board)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Manage Collaborators
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteClick}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>

        <CardTitle className="text-lg">{board.title}</CardTitle>
        {board.description && (
          <CardDescription className="line-clamp-2">
            {board.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          {/* Collaborators Avatar Group */}
          <div className="flex items-center">
            {collaboratorsToShow.length > 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:transition-all">
                  {collaboratorsToShow.map((collaborator) => (
                    <Avatar key={collaborator.id} className="h-8 w-8">
                      <AvatarImage
                        src={collaborator.avatar}
                        alt={collaborator.name}
                      />
                      <AvatarFallback className="text-xs">
                        {collaborator.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {remainingCount > 0 && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        +{remainingCount}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onManageCollaborators(board);
                  }}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="sr-only">Add collaborator</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onManageCollaborators(board);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Collaborators
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Delete Dialog - Outside the dropdown to avoid nesting issues */}
      <DeleteBoardDialog
        board={board}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />
    </Card>
  );
}
