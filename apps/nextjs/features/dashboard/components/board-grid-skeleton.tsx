interface BoardGridSkeletonProps {
  count?: number;
}

export function BoardGridSkeleton({ count = 6 }: BoardGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={`skeleton-${Date.now()}-${i}`}
          className="bg-card border rounded-lg p-6 space-y-4 animate-pulse"
        >
          {/* Title skeleton */}
          <div className="h-6 bg-muted rounded w-3/4"></div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>

          {/* Footer skeleton */}
          <div className="flex justify-between items-center pt-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-8 bg-muted rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
