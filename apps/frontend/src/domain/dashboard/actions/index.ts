"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
// biome-ignore lint/correctness/noUnusedImports: <Because it is a namespace>
import { boards } from "@/lib/client";
import getRequestClient from "@/lib/getRequestClient";
import type { Board } from "../types";

export async function getBoards(searchTerm: string): Promise<Board[]> {
  try {
    const { sessionId } = await auth();
    if (!sessionId) throw Error("Unauthorized");

    const client_clerk = await clerkClient();
    const token = await client_clerk.sessions.getToken(sessionId);
    const client = getRequestClient(token.jwt);

    const response = await client.boards.read(
      searchTerm.length !== 0 ? { searchTerm } : {},
    );

    const boards = response.boards.map(
      (board: boards.Board): Board => ({
        id: board.id,
        slug: board.slug,
        title: board.name,
        description: board.description ?? undefined,
        collaborators: [], // TODO: service should return collaborators too
      }),
    );

    return boards;
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw new Error("Something went wrong. Please try again later");
  }
}

export async function createBoard(params: {
  name: string;
  description?: string;
}): Promise<Board> {
  try {
    const { sessionId } = await auth();
    if (!sessionId) throw Error("Unauthorized");

    const client_clerk = await clerkClient();
    const token = await client_clerk.sessions.getToken(sessionId);
    const client = getRequestClient(token.jwt);

    const response = await client.boards.create({
      name: params.name,
      description: params.description || null,
    });

    const board: Board = {
      id: response.board.id,
      slug: response.board.slug,
      title: response.board.name,
      description: response.board.description ?? undefined,
      collaborators: [], // TODO: service should return collaborators too
    };

    return board;
  } catch (error) {
    console.error("Error creating board:", error);
    throw new Error("Failed to create board. Please try again later");
  }
}

export async function deleteBoard(boardId: string): Promise<void> {
  try {
    const { sessionId } = await auth();
    if (!sessionId) throw Error("Unauthorized");

    const client_clerk = await clerkClient();
    const token = await client_clerk.sessions.getToken(sessionId);
    const client = getRequestClient(token.jwt);

    await client.boards.remove(boardId);
  } catch (error) {
    console.error("Error deleting board:", error);
    throw new Error("Failed to delete board. Please try again later");
  }
}
