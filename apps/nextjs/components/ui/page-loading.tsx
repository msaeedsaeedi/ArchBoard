interface PageLoadingProps {
	message?: string;
	showProgress?: boolean;
}

export function PageLoading({
	message = "Loading...",
	showProgress = true,
}: PageLoadingProps) {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<div className="text-center space-y-4">
				{showProgress && (
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
				)}
				<div className="space-y-2">
					<p className="text-lg font-medium">{message}</p>
					<p className="text-sm text-muted-foreground">
						Please wait while we prepare everything for you
					</p>
				</div>
			</div>
		</div>
	);
}
