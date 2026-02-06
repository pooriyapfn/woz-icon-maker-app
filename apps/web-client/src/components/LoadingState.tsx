import React, { useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { StepIndicator } from "./StepIndicator";
import { ScreenWrapper } from "./ScreenWrapper";
import type { JobStatus } from "../schemas/job";

interface LoadingStateProps {
  status: JobStatus;
  refinedPrompt?: string | null;
}

const statusMessages: Record<
  string,
  { title: string; message: string; step: number }
> = {
  pending: {
    title: "Starting up",
    message: "Initializing your request…",
    step: 1,
  },
  generating_candidates: {
    title: "Creating options",
    message: "Generating icon candidates…",
    step: 1,
  },
  editing_image: {
    title: "Editing design",
    message: "Applying your changes to the icon…",
    step: 2,
  },
  processing_final: {
    title: "Finalizing",
    message: "Packaging your icons in all sizes…",
    step: 3,
  },
};

export default function LoadingState({
  status,
  refinedPrompt,
}: LoadingStateProps) {
  const config = statusMessages[status] || statusMessages.pending;
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <ScreenWrapper>
      <View className="flex-1">
        <View className="px-5 pt-2 pb-3">
          <StepIndicator currentStep={config.step} />
          <Text className="text-3xl font-bold text-slate-900">
            {config.title}
          </Text>
          <Text className="text-slate-500 mt-1">{config.message}</Text>
        </View>

        <View className="flex-1 px-5 items-center">
          <View className="w-full bg-white rounded-2xl border border-slate-200 p-6">
            <View className="items-center">
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text className="text-slate-700 font-semibold mt-4">
                Please keep this screen open
              </Text>
              <Text className="text-slate-500 text-center mt-1">
                We’ll update this automatically as soon as it’s ready.
              </Text>
            </View>

            {refinedPrompt ? (
              <View className="mt-5">
                <Pressable
                  onPress={() => setShowPrompt((v) => !v)}
                  className="flex-row items-center justify-between"
                >
                  <Text className="text-sm font-semibold text-slate-700">
                    Enhanced prompt
                  </Text>
                  <Text className="text-sm text-indigo-600 font-semibold">
                    {showPrompt ? "Hide" : "Show"}
                  </Text>
                </Pressable>

                {showPrompt && (
                  <View className="mt-3 bg-slate-50 rounded-2xl border border-slate-200 p-4">
                    <Text className="text-slate-700 italic">
                      "{refinedPrompt}"
                    </Text>
                  </View>
                )}
              </View>
            ) : null}

            <View className="mt-5 bg-indigo-50 rounded-2xl border border-indigo-100 p-4">
              <Text className="text-indigo-700 text-center text-sm">
                Tip: The more specific your prompt, the better the candidates.
              </Text>
            </View>
          </View>
        </View>

        <View className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-3 bg-slate-50 border-t border-slate-200">
          <View className="h-14 rounded-2xl items-center justify-center bg-slate-200">
            <Text className="text-slate-500 font-semibold">Working…</Text>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
