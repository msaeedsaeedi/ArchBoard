"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut, Moon, SquareRoundCorner, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { toastService } from "@/lib/services/toast";

export default function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const { signOut } = useClerk();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toastService.success("Success", "Logged out successfully");
    } catch {
      toastService.error("Error", "Failed to logout");
    }
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="/" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <SquareRoundCorner size={16} />
              </div>
              Archboard
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
