import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { PromptInputSchema } from "../schemas/job";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <View className="flex-row justify-center mb-6">
      {[1, 2, 3].map((step) => (
        <View key={step} className="flex-row items-center">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              step === currentStep
                ? "bg-indigo-600"
                : step < currentStep
                  ? "bg-indigo-400"
                  : "bg-slate-200"
            }`}
          >
            <Text
              className={`font-semibold ${
                step <= currentStep ? "text-white" : "text-slate-500"
              }`}
            >
              {step}
            </Text>
          </View>
          {step < 3 && (
            <View
              className={`w-12 h-1 mx-1 ${
                step < currentStep ? "bg-indigo-400" : "bg-slate-200"
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );
}

export default function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const result = PromptInputSchema.safeParse(prompt);
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid input");
      return;
    }
    setError(null);
    onSubmit(prompt);
  };

  const characterCount = prompt.length;
  const isOverLimit = characterCount > 500;

  return (
    <View className="flex-1 bg-slate-50 items-center justify-center p-5">
      <View className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-lg">
        <StepIndicator currentStep={1} />

        <Text className="text-2xl font-bold mb-2 text-center text-slate-900">
          Describe Your Icon
        </Text>
        <Text className="text-slate-500 mb-6 text-center">
          Tell us what kind of app icon you want to create
        </Text>

        <View className="mb-4">
          <TextInput
            className="border border-slate-200 rounded-xl p-4 text-lg bg-slate-50 min-h-[100px]"
            style={{ textAlignVertical: "top" }}
            placeholder="e.g. A minimalist mountain landscape with a sunset, using gradients of orange and purple"
            value={prompt}
            onChangeText={(text) => {
              setPrompt(text);
              if (error) setError(null);
            }}
            multiline
            numberOfLines={4}
          />
          <View className="flex-row justify-between mt-2">
            <Text className={`text-sm ${error ? "text-red-500" : "text-slate-400"}`}>
              {error || " "}
            </Text>
            <Text
              className={`text-sm ${isOverLimit ? "text-red-500" : "text-slate-400"}`}
            >
              {characterCount}/500
            </Text>
          </View>
        </View>

        <Pressable
          className={`p-4 rounded-xl items-center ${
            isLoading || isOverLimit || characterCount < 3
              ? "bg-slate-300"
              : "bg-indigo-600 active:bg-indigo-700"
          }`}
          onPress={handleSubmit}
          disabled={isLoading || isOverLimit || characterCount < 3}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Generate Candidates
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export { StepIndicator };
