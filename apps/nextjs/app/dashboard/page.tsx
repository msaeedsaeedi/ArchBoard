"use client";

import { useEffect, useState } from "react";
import { Search, Plus, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthGuard } from "@/lib/hooks/auth.hooks";
import { useAuthStore } from "@/lib/store/auth.store";
import { useBoardStore } from "@/lib/store/board.store";
import { toastService } from "@/lib/services/toast.service";
import { BoardList } from "@/components/dashboard/board-list";
import { CreateBoardDialog } from "@/components/dashboard/create-board-dialog";

export default function DashboardPage() {
  const { isAuthenticated, isInitialized } = useAuthGuard();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const { user, logout } = useAuthStore();
  const { searchTerm, setSearchTerm, fetchBoards } = useBoardStore();

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      fetchBoards().catch((error) => {
        toastService.error("Error", "Failed to load boards");
        console.error("Failed to fetch boards:", error);
      });
    }
  }, [isAuthenticated, isInitialized, fetchBoards]);

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

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by the auth guard
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">ArchBoard</h1>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search boards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <BoardList />
      </main>

      {/* Create Board Dialog */}
      <CreateBoardDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
