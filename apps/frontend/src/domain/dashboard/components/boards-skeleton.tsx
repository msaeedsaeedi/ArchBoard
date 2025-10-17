import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BoardsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }, (_, i) => (
        <Card key={`skeleton-${Date.now()}-${i}`}>
          <CardHeader>
            {/* Action Button */}
            <CardAction>
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardAction>
            {/* Title */}
            <Skeleton className="h-6 w-3/4" />
            {/* Description */}
            <div className="space-y-2 mt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {/* Collaborators skeleton */}
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
