import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Get the current session on the server side
 * @returns Promise<Session | null>
 */
export async function getCurrentSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}

/**
 * Get the current user from the server session
 * @returns Promise<Session["user"] | null>
 */
export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

/**
 * Require authentication for a page/API route
 * Redirects to login if not authenticated
 * @param redirectTo - Optional redirect path after login
 * @returns Promise<Session>
 */
export async function requireAuth(redirectTo?: string): Promise<Session> {
  const session = await getCurrentSession();

  if (!session) {
    const loginUrl = redirectTo
      ? `/login?callbackUrl=${encodeURIComponent(redirectTo)}`
      : "/login";
    redirect(loginUrl);
  }

  return session;
}

/**
 * Check if user is authenticated (for conditional rendering)
 * @returns Promise<boolean>
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return !!session;
}

/**
 * Protect API routes - use in API route handlers
 * @param req - Request object (not used in app dir but kept for compatibility)
 * @returns Promise<Session>
 * @throws Response with 401 status if not authenticated
 */
export async function protectApiRoute(): Promise<Session> {
  const session = await getCurrentSession();

  if (!session) {
    throw new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return session;
}
