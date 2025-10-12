import type { Board } from "@/lib/types";
import { getCurrentSession } from "@/lib/utils/auth";

export async function getBoards(): Promise<Board[]> {
  const session = await getCurrentSession();

  if (!session) {
    throw new Error("User not authenticated");
  }

  try {
    // For server-side actions, we'll use a mock for now since
    // we need to properly implement JWT token passing to the backend
    // In production, you'd authenticate with your backend using the session

    // Mock data for demonstration
    const mockBoards: Board[] = [
      {
        id: 1,
        slug: "project-planning",
        title: "Project Planning",
        description: "Planning board for the new project",
        collaborated: false,
      },
      {
        id: 2,
        slug: "team-collaboration",
        title: "Team Collaboration",
        description: "Shared board for team discussions",
        collaborated: true,
      },
    ];

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return mockBoards;

    // TODO: Replace with actual API call once backend integration is properly set up
    // const response = await fetch(`${process.env.BACKEND_API_URL}/board`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${session.user.accessToken}`, // You'd need to store this in session
    //   },
    //   cache: "no-store",
    // });

    // if (!response.ok) {
    //   throw new Error("Failed to fetch boards");
    // }

    // return await response.json();
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw new Error("Something went wrong. Please try again later");
  }
}
