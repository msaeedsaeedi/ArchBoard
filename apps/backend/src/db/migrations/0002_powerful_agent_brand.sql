ALTER TABLE "boards" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "deletedAt" timestamp;