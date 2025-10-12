export function BoardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton matching the board page */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
              <div>
                <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-24 animate-pulse mt-1"></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main board area skeleton */}
      <main className="flex-1 bg-muted/20">
        <div className="h-[calc(100vh-80px)] bg-muted/10 animate-pulse">
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="h-8 bg-muted rounded w-48 mx-auto animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
