import { z } from "zod";

export const CATEGORIES = ["Exam", "Event", "General"] as const;
export const PRIORITIES = ["Normal", "Urgent"] as const;

// Server-side validation schema. This is the single source of truth and runs
// inside the API routes, so invalid input is rejected even if the browser
// checks are bypassed.
export const noticeInputSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  body: z
    .string({ required_error: "Body is required" })
    .trim()
    .min(1, "Body is required")
    .max(5000, "Body must be 5000 characters or fewer"),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: "Category must be Exam, Event, or General" }),
  }),
  priority: z.enum(PRIORITIES, {
    errorMap: () => ({ message: "Priority must be Normal or Urgent" }),
  }),
  publishDate: z
    .string({ required_error: "Publish date is required" })
    .trim()
    .min(1, "Publish date is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: "Publish date must be a valid date",
    }),
  // Optional image. Accept a valid URL or treat an empty value as "no image".
  imageUrl: z
    .union([z.string().trim().url("Image must be a valid URL"), z.literal("")])
    .nullish()
    .transform((value) => (value ? value : null)),
});

export type NoticeInput = z.infer<typeof noticeInputSchema>;

// Flattens Zod errors into a simple { field: message } map for the client.
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.errors) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
