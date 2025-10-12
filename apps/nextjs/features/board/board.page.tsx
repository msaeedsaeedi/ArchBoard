"use client";

import { ArrowLeft, MoreHorizontal, Settings, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();

  const boardId = params.id as string;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div>
                <h1 className="text-xl font-semibold">Board: {boardId}</h1>
                <p className="text-sm text-muted-foreground">
                  Collaborative whiteboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Collaborators
              </Button>

              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>

              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main board area */}
      <main className="flex-1 bg-muted/20">
        <div className="h-[calc(100vh-80px)] bg-muted/10">
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-muted-foreground">
                Board Canvas
              </h2>
              <p className="text-muted-foreground">
                This is where the collaborative whiteboard will be implemented
              </p>
              <p className="text-sm text-muted-foreground">
                Board ID: {boardId}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
