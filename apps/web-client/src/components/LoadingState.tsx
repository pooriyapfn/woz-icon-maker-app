import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { StepIndicator } from "./PromptInput";
import type { JobStatus } from "../schemas/job";

interface LoadingStateProps {
  status: JobStatus;
  refinedPrompt?: string | null;
}

const statusMessages: Record<string, { title: string; message: string; step: number }> = {
  pending: {
    title: "Starting Up",
    message: "Initializing your request...",
    step: 1,
  },
  generating_candidates: {
    title: "Creating Options",
    message: "AI is generating icon candidates for you...",
    step: 1,
  },
  processing_final: {
    title: "Finalizing",
    message: "Creating your icon package with all sizes...",
    step: 3,
  },
};

export default function LoadingState({ status, refinedPrompt }: LoadingStateProps) {
  const config = statusMessages[status] || statusMessages.pending;

  return (
    <View className="flex-1 bg-slate-50 items-center justify-center p-5">
      <View className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-lg items-center">
        <StepIndicator currentStep={config.step} />

        <ActivityIndicator size="large" color="#4f46e5" className="mb-6" />

        <Text className="text-2xl font-bold mb-2 text-center text-slate-900">
          {config.title}
        </Text>
        <Text className="text-slate-500 mb-4 text-center">
          {config.message}
        </Text>

        {refinedPrompt && (
          <View className="bg-slate-50 p-4 rounded-xl mt-4 w-full">
            <Text className="text-sm text-slate-500 mb-1">Enhanced prompt:</Text>
            <Text className="text-slate-700 italic">"{refinedPrompt}"</Text>
          </View>
        )}

        <View className="bg-indigo-50 p-4 rounded-xl mt-4 w-full">
          <Text className="text-sm text-indigo-700 text-center">
            This may take a moment. Feel free to wait while we work our magic.
          </Text>
        </View>
      </View>
    </View>
  );
}
