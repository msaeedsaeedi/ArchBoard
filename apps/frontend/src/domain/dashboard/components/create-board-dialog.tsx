"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toastService } from "@/lib/services/toast";
import { cn } from "@/lib/utils";
import { createBoard } from "../actions";
import type { Board } from "../types";

interface CreateBoardDialogProps {
  onSuccess?: (board: Board) => void;
}

export function CreateBoardDialog({ onSuccess }: CreateBoardDialogProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  function handleSuccess(board: Board) {
    onSuccess?.(board);
    setOpen(false);
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Create Board">
                <PlusIcon />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create new board</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
            <DialogDescription>
              Create a new board to organize your architecture diagrams and
              collaborate with your team.
            </DialogDescription>
          </DialogHeader>
          <CreateBoardForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Create Board">
              <PlusIcon />
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create new board</p>
        </TooltipContent>
      </Tooltip>

      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create New Board</DrawerTitle>
          <DrawerDescription>
            Create a new board to organize your architecture diagrams and
            collaborate with your team.
          </DrawerDescription>
        </DrawerHeader>
        <CreateBoardForm className="px-4" onSuccess={handleSuccess} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

/**
 * Create Board Form
 */

const CreateBoardSchema = z.object({
  name: z.string().min(1, "Board name is required"),
  description: z.string().optional(),
});

type CreateBoardValues = z.infer<typeof CreateBoardSchema>;

export function CreateBoardForm({
  className,
  onSuccess,
}: {
  className?: string;
  onSuccess?: (board: Board) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBoardValues>({
    resolver: zodResolver(CreateBoardSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateBoardValues) => {
    try {
      const board = await createBoard({
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
      });

      toastService.success("Board created successfully!");
      reset();
      onSuccess?.(board);
    } catch {
      toastService.error("Failed to create board", "Please try again later");
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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Board"}
      </Button>
    </form>
  );
}
