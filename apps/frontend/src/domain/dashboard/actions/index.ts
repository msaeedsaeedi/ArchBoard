import type { Board } from "../types";

export async function getBoards(searchTerm?: string): Promise<Board[]> {
  try {
    const mockBoards: Board[] = [
      {
        id: 1,
        slug: "project-planning",
        title: "Project Planning",
        description:
          "Planning board for the new project with detailed roadmap and timeline management",
        sharedBoard: false,
        collaborators: [
          {
            id: "1",
            name: "John Doe",
            avatar: "https://github.com/shadcn.png",
            initials: "JD",
          },
          {
            id: "2",
            name: "Jane Smith",
            avatar: "https://github.com/maxleiter.png",
            initials: "JS",
          },
        ],
      },
      {
        id: 2,
        slug: "team-collaboration",
        title: "Team Collaboration",
        description:
          "Shared board for team discussions and brainstorming sessions",
        sharedBoard: true,
        collaborators: [
          {
            id: "3",
            name: "Alice Johnson",
            avatar: "https://github.com/evilrabbit.png",
            initials: "AJ",
          },
          {
            id: "4",
            name: "Bob Wilson",
            initials: "BW",
          },
          {
            id: "5",
            name: "Charlie Brown",
            initials: "CB",
          },
          {
            id: "6",
            name: "Diana Davis",
            initials: "DD",
          },
        ],
      },
      {
        id: 3,
        slug: "personal-tasks",
        title: "Personal Tasks",
        description:
          "My personal task management board for daily activities and goals",
        sharedBoard: false,
        collaborators: [],
      },
      {
        id: 4,
        slug: "design-system",
        title: "Design System",
        description: "Component library and design guidelines for the product",
        sharedBoard: true,
        collaborators: [
          {
            id: "7",
            name: "Eva Martinez",
            avatar: "https://github.com/shadcn.png",
            initials: "EM",
          },
        ],
      },
      {
        id: 5,
        slug: "design-system",
        title: "Design System",
        description: "Component library and design guidelines for the product",
        sharedBoard: true,
        collaborators: [
          {
            id: "7",
            name: "Eva Martinez",
            avatar: "https://github.com/shadcn.png",
            initials: "EM",
          },
        ],
      },
      {
        id: 6,
        slug: "design-system",
        title: "Design System",
        description: "Component library and design guidelines for the product",
        sharedBoard: true,
        collaborators: [
          {
            id: "7",
            name: "Eva Martinez",
            avatar: "https://github.com/shadcn.png",
            initials: "EM",
          },
        ],
      },
    ];

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockBoards.filter((value) => {
      const query = value.title.toLowerCase().trim() ?? "";
      return query.includes(searchTerm?.toLowerCase() ?? "");
    });
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw new Error("Something went wrong. Please try again later");
  }
}
