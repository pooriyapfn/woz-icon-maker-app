import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type {
  Job,
  CreateJobPayload,
  SelectForReviewPayload,
  RequestEditPayload,
  FinalizeSelectionPayload,
} from "../schemas/job";

export const JOB_QUERY_KEY = "currentJob";

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      prompt,
      logoUrl,
    }: {
      prompt: string;
      logoUrl: string | null;
    }): Promise<Job> => {
      const payload: CreateJobPayload = {
        prompt,
        status: "pending",
        logo_url: logoUrl,
      };

      const { data, error } = await supabase
        .from("jobs")
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data as Job;
    },
    onSuccess: (data) => {
      queryClient.setQueryData([JOB_QUERY_KEY], data);
    },
  });
}

export function useSelectForReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobId,
      selectedIndex,
    }: {
      jobId: string;
      selectedIndex: number;
    }): Promise<Job> => {
      const payload: SelectForReviewPayload = {
        selected_candidate_index: selectedIndex,
        status: "waiting_for_edit_decision",
      };

      const { data, error } = await supabase
        .from("jobs")
        .update(payload)
        .eq("id", jobId)
        .select()
        .single();

      if (error) throw error;
      return data as Job;
    },
    onSuccess: (data) => {
      queryClient.setQueryData([JOB_QUERY_KEY], data);
    },
  });
}

export function useRequestEdit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobId,
      editPrompt,
    }: {
      jobId: string;
      editPrompt: string;
    }): Promise<Job> => {
      const payload: RequestEditPayload = {
        edit_prompt: editPrompt,
        status: "editing_image",
      };

      const { data, error } = await supabase
        .from("jobs")
        .update(payload)
        .eq("id", jobId)
        .select()
        .single();

      if (error) throw error;
      return data as Job;
    },
    onSuccess: (data) => {
      queryClient.setQueryData([JOB_QUERY_KEY], data);
    },
  });
}

export function useFinalizeSelection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId }: { jobId: string }): Promise<Job> => {
      const payload: FinalizeSelectionPayload = {
        status: "processing_final",
      };

      const { data, error } = await supabase
        .from("jobs")
        .update(payload)
        .eq("id", jobId)
        .select()
        .single();

      if (error) throw error;
      return data as Job;
    },
    onSuccess: (data) => {
      queryClient.setQueryData([JOB_QUERY_KEY], data);
    },
  });
}
