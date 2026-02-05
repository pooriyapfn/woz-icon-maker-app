import React from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
  useCreateJob,
  useSelectCandidate,
  JOB_QUERY_KEY,
} from "./hooks/useJob";
import { useJobSubscription } from "./hooks/useJobSubscription";
import type { Job } from "./schemas/job";
import PromptInput from "./components/PromptInput";
import CandidateSelector from "./components/CandidateSelector";
import LoadingState from "./components/LoadingState";
import DownloadComplete from "./components/DownloadComplete";
import ErrorDisplay from "./components/ErrorDisplay";

export default function MainScreen() {
  const queryClient = useQueryClient();
  const { data: currentJob } = useQuery<Job | null>({
    queryKey: [JOB_QUERY_KEY],
    queryFn: () => null,
    initialData: null,
    staleTime: Infinity,
  });

  const createJobMutation = useCreateJob();
  const selectCandidateMutation = useSelectCandidate();

  useJobSubscription(currentJob?.id ?? null);

  const handleCreateJob = (prompt: string) => {
    createJobMutation.mutate(prompt);
  };

  const handleSelectCandidate = (index: number) => {
    if (currentJob) {
      selectCandidateMutation.mutate({
        jobId: currentJob.id,
        selectedIndex: index,
      });
    }
  };

  const handleStartOver = () => {
    queryClient.setQueryData([JOB_QUERY_KEY], null);
    createJobMutation.reset();
    selectCandidateMutation.reset();
  };

  if (!currentJob) {
    return (
      <PromptInput
        onSubmit={handleCreateJob}
        isLoading={createJobMutation.isPending}
      />
    );
  }

  // Route based on job status
  switch (currentJob.status) {
    case "pending":
    case "generating_candidates":
      return (
        <LoadingState
          status={currentJob.status}
          refinedPrompt={currentJob.refined_prompt}
        />
      );

    case "waiting_for_selection":
      return (
        <CandidateSelector
          candidates={currentJob.candidate_urls || []}
          onSelect={handleSelectCandidate}
          isLoading={selectCandidateMutation.isPending}
        />
      );

    case "processing_final":
      return (
        <LoadingState
          status={currentJob.status}
          refinedPrompt={currentJob.refined_prompt}
        />
      );

    case "completed":
      return (
        <DownloadComplete
          downloadUrl={currentJob.zip_download_url || ""}
          onStartOver={handleStartOver}
        />
      );

    case "failed":
      return (
        <ErrorDisplay
          message={currentJob.error_message || "An unknown error occurred"}
          onRetry={handleStartOver}
        />
      );

    default:
      return (
        <LoadingState
          status="pending"
          refinedPrompt={currentJob.refined_prompt}
        />
      );
  }
}
