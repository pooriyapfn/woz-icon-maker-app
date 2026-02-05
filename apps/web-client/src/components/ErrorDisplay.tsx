import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

function parseErrorMessage(raw: string): { friendly: string; technical: string } {
  // Try to extract a friendly message from common error patterns
  if (raw.includes("quota") || raw.includes("429")) {
    return { friendly: "API rate limit exceeded. Please try again later.", technical: raw };
  }
  if (raw.includes("503") || raw.includes("UNAVAILABLE")) {
    return { friendly: "Service temporarily unavailable. Please try again.", technical: raw };
  }
  if (raw.includes("Invalid response")) {
    return { friendly: "Failed to generate images. Please try again.", technical: raw };
  }
  if (raw.includes("timeout") || raw.includes("TIMED_OUT")) {
    return { friendly: "Request timed out. Please try again.", technical: raw };
  }
  // Default: show as-is if short, otherwise truncate
  if (raw.length < 100) {
    return { friendly: raw, technical: "" };
  }
  return { friendly: "An error occurred while processing your request.", technical: raw };
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { friendly, technical } = parseErrorMessage(message);

  return (
    <View className="flex-1 bg-slate-50 items-center justify-center p-5">
      <View className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-lg items-center">
        <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-6">
          <Text className="text-4xl">!</Text>
        </View>

        <Text className="text-2xl font-bold mb-2 text-center text-slate-900">
          Something Went Wrong
        </Text>

        <View className="bg-red-50 p-4 rounded-xl mb-4 w-full">
          <Text className="text-red-700 text-center">{friendly}</Text>
        </View>

        {technical && (
          <Pressable onPress={() => setShowDetails(!showDetails)} className="mb-4">
            <Text className="text-slate-400 text-sm underline">
              {showDetails ? "Hide details" : "Show details"}
            </Text>
          </Pressable>
        )}

        {showDetails && technical && (
          <ScrollView className="bg-slate-100 p-3 rounded-lg mb-4 max-h-32 w-full">
            <Text className="text-slate-600 text-xs font-mono">{technical}</Text>
          </ScrollView>
        )}

        <Pressable
          className="p-4 rounded-xl items-center w-full bg-indigo-600 active:bg-indigo-700"
          onPress={onRetry}
        >
          <Text className="text-white font-semibold text-lg">Try Again</Text>
        </Pressable>
      </View>
    </View>
  );
}
