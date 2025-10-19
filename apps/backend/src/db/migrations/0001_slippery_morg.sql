ALTER TABLE "boards" RENAME COLUMN "id" TO "boardId";--> statement-breakpoint
ALTER TABLE "board_collaborators" DROP CONSTRAINT "board_collaborators_board_id_boards_id_fk";
--> statement-breakpoint
ALTER TABLE "board_collaborators" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "board_collaborators" ADD CONSTRAINT "board_collaborators_board_id_boards_boardId_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("boardId") ON DELETE no action ON UPDATE no action;