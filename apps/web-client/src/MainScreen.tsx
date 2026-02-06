import React from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
  useCreateJob,
  useSelectForReview,
  useRequestEdit,
  useFinalizeSelection,
  JOB_QUERY_KEY,
} from "./hooks/useJob";
import { useJobSubscription } from "./hooks/useJobSubscription";
import type { Job } from "./schemas/job";
import PromptInput from "./components/PromptInput";
import CandidateSelector from "./components/CandidateSelector";
import LoadingState from "./components/LoadingState";
import DownloadComplete from "./components/DownloadComplete";
import ErrorDisplay from "./components/ErrorDisplay";
import EditDecision from "./components/EditDecision";

export default function MainScreen() {
  const queryClient = useQueryClient();
  const { data: currentJob } = useQuery<Job | null>({
    queryKey: [JOB_QUERY_KEY],
    queryFn: () => null,
    initialData: null,
    staleTime: Infinity,
  });

  const createJobMutation = useCreateJob();
  const selectForReviewMutation = useSelectForReview();
  const requestEditMutation = useRequestEdit();
  const finalizeSelectionMutation = useFinalizeSelection();

  useJobSubscription(currentJob?.id ?? null);

  const handleCreateJob = (prompt: string, logoUrl: string | null) => {
    createJobMutation.mutate({ prompt, logoUrl });
  };

  const handleSelectForReview = (index: number) => {
    if (currentJob) {
      selectForReviewMutation.mutate({
        jobId: currentJob.id,
        selectedIndex: index,
      });
    }
  };

  const handleRequestEdit = (editPrompt: string) => {
    if (currentJob) {
      requestEditMutation.mutate({
        jobId: currentJob.id,
        editPrompt,
      });
    }
  };

  const handleFinalizeSelection = () => {
    if (currentJob) {
      finalizeSelectionMutation.mutate({ jobId: currentJob.id });
    }
  };

  const handleStartOver = () => {
    queryClient.setQueryData([JOB_QUERY_KEY], null);
    createJobMutation.reset();
    selectForReviewMutation.reset();
    requestEditMutation.reset();
    finalizeSelectionMutation.reset();
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
          onSelect={handleSelectForReview}
          isLoading={selectForReviewMutation.isPending}
        />
      );

    case "waiting_for_edit_decision": {
      const selectedUrl =
        currentJob.candidate_urls?.[currentJob.selected_candidate_index ?? 0] ||
        "";
      return (
        <EditDecision
          imageUrl={selectedUrl}
          onEdit={handleRequestEdit}
          onStartFresh={handleStartOver}
          onFinalize={handleFinalizeSelection}
          isLoading={
            requestEditMutation.isPending || finalizeSelectionMutation.isPending
          }
        />
      );
    }

    case "editing_image":
      return (
        <LoadingState
          status={currentJob.status}
          refinedPrompt={currentJob.refined_prompt}
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
