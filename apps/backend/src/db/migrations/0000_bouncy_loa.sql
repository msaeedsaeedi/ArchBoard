CREATE TYPE "public"."roles" AS ENUM('viewer', 'editor');--> statement-breakpoint
CREATE TABLE "board_collaborators" (
	"board_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "roles" DEFAULT 'viewer',
	CONSTRAINT "board_collaborators_board_id_user_id_pk" PRIMARY KEY("board_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "boards" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"owner" text NOT NULL,
	CONSTRAINT "boards_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image_url" text
);
--> statement-breakpoint
ALTER TABLE "board_collaborators" ADD CONSTRAINT "board_collaborators_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_collaborators" ADD CONSTRAINT "board_collaborators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;