import { z } from "zod";

export const JobStatus = z.enum([
  "pending",
  "generating_candidates",
  "waiting_for_selection",
  "waiting_for_edit_decision",
  "editing_image",
  "processing_final",
  "completed",
  "failed",
]);

export type JobStatus = z.infer<typeof JobStatus>;

export const PromptInputSchema = z
  .string()
  .min(3, "Prompt must be at least 3 characters")
  .max(500, "Prompt must be at most 500 characters");

export const JobSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string(),
  prompt: z.string(),
  status: JobStatus,
  refined_prompt: z.string().nullable(),
  candidate_urls: z.array(z.string()).nullable(),
  selected_candidate_index: z.number().int().nullable(),
  edit_prompt: z.string().nullable(),
  master_image_url: z.string().nullable(),
  zip_download_url: z.string().nullable(),
  error_message: z.string().nullable(),
  logo_url: z.string().nullable(),
});

export type Job = z.infer<typeof JobSchema>;

export const CreateJobPayload = z.object({
  prompt: PromptInputSchema,
  status: z.literal("pending"),
  logo_url: z.string().nullable().optional(),
});

export type CreateJobPayload = z.infer<typeof CreateJobPayload>;

export const SelectForReviewPayload = z.object({
  selected_candidate_index: z.number().int().min(0).max(3),
  status: z.literal("waiting_for_edit_decision"),
});

export type SelectForReviewPayload = z.infer<typeof SelectForReviewPayload>;

export const RequestEditPayload = z.object({
  edit_prompt: z.string().min(1),
  status: z.literal("editing_image"),
});

export type RequestEditPayload = z.infer<typeof RequestEditPayload>;

export const FinalizeSelectionPayload = z.object({
  status: z.literal("processing_final"),
});

export type FinalizeSelectionPayload = z.infer<typeof FinalizeSelectionPayload>;
