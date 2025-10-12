"use client";

import { LogOut, Moon, Plus, RefreshCw, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toastService } from "@/lib/services/toast.service";
import type { User } from "@/lib/types";
import { useAuth } from "../../auth/hooks/useAuth";
import { CreateBoardDialog } from "./create-board-dialog";

interface DashboardHeaderProps {
  user: User | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toastService.success("Success", "Logged out successfully");
    } catch {
      toastService.error("Error", "Failed to logout");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleRefresh = () => {
    router.refresh();
    toastService.success("Success", "Boards refreshed successfully");
  };

  const handleBoardCreated = () => {
    setIsCreateDialogOpen(false);
    router.refresh(); // Refresh the page to show the new board
  };

  return (
    <>
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your boards and collaborate with others
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Board
              </Button>

              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {user && (
            <div className="mt-4">
              <p className="text-muted-foreground">
                Welcome back,{" "}
                <span className="font-medium">{user.fullName}</span>
              </p>
            </div>
          )}
        </div>
      </header>

      <CreateBoardDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onBoardCreated={handleBoardCreated}
      />
    </>
  );
}
