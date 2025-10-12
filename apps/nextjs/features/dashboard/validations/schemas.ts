import { z } from "zod";

export const boardSchema = z.object({
  title: z
    .string()
    .min(1, "Board title is required")
    .min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
});

export const collaboratorSchema = z.object({
  email: z.email("Please enter a valid email address"),
  role: z.enum(["VIEWER", "EDITOR"], {
    message: "Please select a role",
  }),
});

export type BoardFormData = z.infer<typeof boardSchema>;
export type CollaboratorFormData = z.infer<typeof collaboratorSchema>;
