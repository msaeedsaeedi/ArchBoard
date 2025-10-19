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
        boardId: board.boardId,
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
      boardId: response.board.boardId,
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

export async function updateBoard(params: {
  id: string;
  name?: string;
  description?: string | null;
}): Promise<Board> {
  try {
    const { sessionId } = await auth();
    if (!sessionId) throw Error("Unauthorized");

    const client_clerk = await clerkClient();
    const token = await client_clerk.sessions.getToken(sessionId);
    const client = getRequestClient(token.jwt);

    // Only send fields that are provided
    const updateData: {
      id: string;
      name?: string;
      description?: string | null;
    } = { id: params.id };

    if (params.name !== undefined) {
      updateData.name = params.name;
    }

    if (params.description !== undefined) {
      updateData.description = params.description;
    }

    const response = await client.boards.update(params.id, updateData);

    const board: Board = {
      boardId: response.board.boardId,
      slug: response.board.slug,
      title: response.board.name,
      description: response.board.description ?? undefined,
      collaborators: [],
    };

    return board;
  } catch (error) {
    console.error("Error updating board:", error);
    throw new Error("Failed to update board. Please try again later");
  }
}
