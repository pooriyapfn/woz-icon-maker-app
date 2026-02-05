import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { JOB_QUERY_KEY } from "./useJob";
import type { Job } from "../schemas/job";

export function useJobSubscription(jobId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!jobId) return;

    const channel = supabase
      .channel(`job-${jobId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "jobs",
          filter: `id=eq.${jobId}`,
        },
        (payload) => {
          console.log("[Realtime] Job update received:", payload.new);
          const updatedJob = payload.new as Job;
          queryClient.setQueryData([JOB_QUERY_KEY], updatedJob);
        }
      )
      .subscribe((status, err) => {
        console.log("[Realtime] Subscription status:", status, err?.message);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, queryClient]);
}
