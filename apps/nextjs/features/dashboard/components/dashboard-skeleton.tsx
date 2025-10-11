import { BoardSkeleton } from "./board-skeleton";

export function DashboardSkeleton() {
	return (
		<div className="min-h-screen bg-background">
			{/* Header - matches the real header height */}
			<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="h-8 bg-muted rounded w-32 animate-pulse"></div>
							<div className="h-10 bg-muted rounded w-64 animate-pulse"></div>
						</div>
						<div className="flex items-center gap-2">
							<div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
							<div className="h-10 w-10 bg-muted rounded animate-pulse"></div>
							<div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
							<div className="h-10 bg-muted rounded w-24 animate-pulse"></div>
						</div>
					</div>

					{/* User welcome section */}
					<div className="mt-4">
						<div className="h-5 bg-muted rounded w-48 animate-pulse"></div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<BoardSkeleton />
			</main>
		</div>
	);
}
