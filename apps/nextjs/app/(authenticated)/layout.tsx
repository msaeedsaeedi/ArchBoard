import { PageErrorBoundary } from "@/components/error-boundary";
import { requireAuth } from "@/lib/utils/auth";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default async function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  // Require authentication for all routes in this group
  // This will redirect to login if not authenticated
  await requireAuth();

  return (
    <div className="min-h-screen bg-background">
      <PageErrorBoundary>{children}</PageErrorBoundary>
    </div>
  );
}
