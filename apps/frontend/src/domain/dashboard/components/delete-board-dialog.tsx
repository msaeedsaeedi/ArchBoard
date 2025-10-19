"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toastService } from "@/lib/services/toast";
import { deleteBoard } from "../actions";
import type { Board } from "../types";

interface DeleteBoardDialogProps {
  board: Board;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (boardId: string) => void;
}

export function DeleteBoardDialog({
  board,
  open,
  onOpenChange,
  onSuccess,
}: DeleteBoardDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteBoard(board.id);
      toastService.success("Board deleted successfully");
      onSuccess?.(board.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete board:", error);
      toastService.error(
        error instanceof Error ? error.message : "Failed to delete board",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the board{" "}
            <span className="font-semibold">"{board.title}"</span> and remove
            all its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel type="button" disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>Delete Board</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
