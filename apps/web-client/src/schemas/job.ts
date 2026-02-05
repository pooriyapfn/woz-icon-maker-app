import { z } from "zod";

export const JobStatus = z.enum([
  "pending",
  "generating_candidates",
  "waiting_for_selection",
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
  master_image_url: z.string().nullable(),
  zip_download_url: z.string().nullable(),
  error_message: z.string().nullable(),
});

export type Job = z.infer<typeof JobSchema>;

export const CreateJobPayload = z.object({
  prompt: PromptInputSchema,
  status: z.literal("pending"),
});

export type CreateJobPayload = z.infer<typeof CreateJobPayload>;

export const SelectCandidatePayload = z.object({
  selected_candidate_index: z.number().int().min(0).max(3),
  status: z.literal("processing_final"),
});

export type SelectCandidatePayload = z.infer<typeof SelectCandidatePayload>;
