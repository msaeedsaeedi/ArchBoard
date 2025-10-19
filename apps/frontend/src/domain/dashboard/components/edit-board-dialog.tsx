"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toastService } from "@/lib/services/toast";
import { cn } from "@/lib/utils";
import { updateBoard } from "../actions";
import type { Board } from "../types";

interface EditBoardDialogProps {
  board: Board;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (board: Board) => void;
}

export function EditBoardDialog({
  board,
  open: controlledOpen,
  onOpenChange: controlledSetOpen,
  onSuccess,
}: EditBoardDialogProps) {
  const [open, setOpen] = React.useState<boolean>(controlledOpen ?? false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  React.useEffect(() => {
    if (controlledOpen !== undefined) setOpen(controlledOpen);
  }, [controlledOpen]);

  function handleSuccess(boardUpdated: Board) {
    onSuccess?.(boardUpdated);
    controlledSetOpen?.(false);
    setOpen(false);
  }

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          controlledSetOpen?.(o);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
            <DialogDescription>Update board details.</DialogDescription>
          </DialogHeader>
          <EditBoardForm board={board} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        controlledSetOpen?.(o);
      }}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Board</DrawerTitle>
          <DrawerDescription>Update board details.</DrawerDescription>
        </DrawerHeader>
        <EditBoardForm
          className="px-4"
          board={board}
          onSuccess={handleSuccess}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const EditBoardSchema = z.object({
  name: z.string().min(1, "Board name is required"),
  description: z.string().optional(),
});

type EditBoardValues = z.infer<typeof EditBoardSchema>;

export function EditBoardForm({
  className,
  board,
  onSuccess,
}: {
  className?: string;
  board: Board;
  onSuccess?: (board: Board) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditBoardValues>({
    resolver: zodResolver(EditBoardSchema),
    defaultValues: {
      name: board.title,
      description: board.description ?? "",
    },
  });

  const hasChanges = (() => {
    const name = watch("name")?.trim() ?? "";
    const description = watch("description")?.trim() ?? "";

    return (
      name !== board.title.trim() ||
      description !== (board.description?.trim() ?? "")
    );
  })();

  const onSubmit = async (data: EditBoardValues) => {
    try {
      const name = data.name.trim();
      const description = data.description?.trim() || null;

      const nameChanged = name !== board.title.trim();
      const descriptionChanged =
        description !== (board.description?.trim() ?? "");

      const updateData = {
        id: board.boardId,
        ...(nameChanged && { name }),
        ...(descriptionChanged && { description }),
      };

      const updated = await updateBoard(updateData);
      toastService.success("Board updated successfully!");

      reset();
      onSuccess?.(updated);
    } catch (err) {
      console.error(err);
      toastService.error("Failed to update board", "Please try again later");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("grid items-start gap-6", className)}
    >
      <div className="grid gap-3">
        <Label htmlFor="name">Board Name</Label>
        <Input id="name" placeholder="Enter board name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          placeholder="Enter board description"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <Button type="submit" disabled={!hasChanges || isSubmitting}>
        {isSubmitting ? "Updating..." : "Update Board"}
      </Button>
    </form>
  );
}
