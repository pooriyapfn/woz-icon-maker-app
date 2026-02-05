import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import type { Job, CreateJobPayload, SelectCandidatePayload } from "../schemas/job";

export const JOB_QUERY_KEY = "currentJob";

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prompt: string): Promise<Job> => {
      const payload: CreateJobPayload = {
        prompt,
        status: "pending",
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

export function useSelectCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobId,
      selectedIndex,
    }: {
      jobId: string;
      selectedIndex: number;
    }): Promise<Job> => {
      const payload: SelectCandidatePayload = {
        selected_candidate_index: selectedIndex,
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
